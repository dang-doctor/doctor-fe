import React, { useState, useMemo, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Alert, Linking, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import Config from 'react-native-config';
// 세션 컨텍스트(앞서 만든 SessionProvider 기준)
import { useSession } from '../session/SessionProvider';

const LoginScreen = ({ navigation, onLoginSuccess }) => {
	const [showWebView, setShowWebView] = useState(false);
	const [loading, setLoading] = useState(false);
	const webviewRef = useRef(null);

	const { login } = useSession?.() || { login: null };

	const KAKAO_LOGIN_URL = Config.KAKAO_LOGIN_URL;
	const KAKAO_REDIRECT_URI = Config.KAKAO_REDIRECT_URI;

	const isUrlValid = useMemo(
		() => typeof KAKAO_LOGIN_URL === 'string' && KAKAO_LOGIN_URL.startsWith('http'),
		[KAKAO_LOGIN_URL]
	);

	const parseQuery = (url) => {
		try {
			const u = new URL(url);
			const params = {};
			u.searchParams.forEach((v, k) => { params[k] = v; });
			return params;
		} catch {
			const q = (url.split('?')[1] || '').split('#')[0];
			return q.split('&').reduce((acc, pair) => {
				const [k, v] = pair.split('=');
				if (!k) return acc;
				acc[decodeURIComponent(k)] = decodeURIComponent(v || '');
				return acc;
			}, {});
		}
	};

	// 핵심: 우리가 직접 백엔드 redirect_uri 엔드포인트를 호출해서 유저 JSON을 받는다.
	const exchangeCodeForUser = async (code) => {
		// 서버가 GET 쿼리로 받는다 했으므로 GET 사용. (POST라면 fetch 옵션만 바꿔주면 됨)
		const url = `${KAKAO_REDIRECT_URI}${KAKAO_REDIRECT_URI.includes('?') ? '&' : '?'}code=${encodeURIComponent(code)}`;
		setLoading(true);
		try {
			const res = await fetch(url, {
				method: 'GET',
				headers: {
					'Accept': 'application/json'
				}
			});
			if (!res.ok) {
				const text = await res.text().catch(() => '');
				throw new Error(`HTTP ${res.status}${text ? `: ${text}` : ''}`);
			}
			const json = await res.json();
			// 서버가 내려주는 스키마에 맞춰 키 이름을 맞춘다.
			// 예: { app_jwt: '...', user: { id: 123, nickname: '...' } }
			const token = json.app_jwt || json.token || json.jwt || null;
			const user = json.user || json.profile || json.data || null;

			// 세션 저장 (SessionProvider 사용 시)
			if (login) {
				await login({ token, user });
				console.log('LOGIN DEBUG → token:', token, ' user:', user);
			}
			// 상위 콜백도 필요하면 함께 호출
			onLoginSuccess?.(token || user);

			// 네비게이션 이동(프로젝트 구조에 맞게 조정)
			// navigation.replace('main');

			Alert.alert('로그인 성공', user?.nickname ? `${user.nickname}님 환영합니다` : '세션이 저장되었습니다.');
			setShowWebView(false);
		} catch (err) {
			Alert.alert('로그인 실패', err?.message || '교환 API 오류');
		} finally {
			setLoading(false);
		}
	};

	const handleWebViewNavigation = (event) => {
		const { url } = event;

		// 1) 카카오 인증 완료 후 redirect_uri?code=... 로 이동하려는 순간 가로채서
		//    실제 네비게이션은 막고(code만 확보), 우리가 직접 API 호출
		if (KAKAO_REDIRECT_URI && url.startsWith(KAKAO_REDIRECT_URI)) {
			const params = parseQuery(url);
			const code = params.code || params.app_code;
			if (code) {
				// WebView 진행 중단
				exchangeCodeForUser(code);
				return false;
			}
			// code가 없으면 서버의 추가 처리(예: 설명 페이지)를 보려는 것일 수 있으니 허용
			return true;
		}

		// 2) 외부 스킴/인텐트는 앱으로 넘김
		if (
			url.startsWith('intent:') ||
			url.startsWith('kakaokompassauth://') ||
			url.startsWith('kakaolink://')
		) {
			Linking.openURL(url).catch(() => {});
			return false;
		}

		return true;
	};

	const handleMessage = (e) => {
		// 이번 플로우는 redirect_uri를 우리가 직접 호출하므로 postMessage는 필수는 아님.
		// 그래도 백엔드가 postMessage로 내려줄 수도 있으니 안전하게 남겨둠.
		try {
			const data = JSON.parse(e?.nativeEvent?.data || '{}');
			if (data?.type === 'LOGIN_OK' && (data?.token || data?.user)) {
				if (login) {
					login({ token: data.token || null, user: data.user || null });
				}
				onLoginSuccess?.(data.token || data.user);
				setShowWebView(false);
			}
			if (data?.type === 'LOGIN_FAIL') {
				setShowWebView(false);
				Alert.alert('로그인 실패', data?.message || '알 수 없는 오류');
			}
		} catch {}
	};

	if (showWebView) {
		if (!isUrlValid) {
			Alert.alert('설정 오류', 'KAKAO_LOGIN_URL이 비어있거나 잘못되었습니다.');
			setShowWebView(false);
			return null;
		}

		return (
			<View style={styles.webviewContainer}>
				{loading && (
					<View style={styles.loadingOverlay}>
						<ActivityIndicator size="large" />
					</View>
				)}
				<WebView
					ref={webviewRef}
					style={styles.webview}
					source={{ uri: KAKAO_LOGIN_URL }}
					onShouldStartLoadWithRequest={handleWebViewNavigation}
					onMessage={handleMessage}
					javaScriptEnabled
					domStorageEnabled
					sharedCookiesEnabled
					thirdPartyCookiesEnabled
					setSupportMultipleWindows
					mixedContentMode="always"
					startInLoadingState
					userAgent="Mozilla/5.0 (Linux; Android 10; Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36"
					onError={(e) => {
						Alert.alert('WebView error', e?.nativeEvent?.description ?? 'unknown error');
					}}
					onHttpError={(e) => {
						Alert.alert('HTTP error', `code: ${e?.nativeEvent?.statusCode}`);
					}}
				/>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Image source={require('../assets/images/logo.png')} style={styles.logo} />
			<TouchableOpacity style={styles.kakaoBtn} onPress={() => setShowWebView(true)}>
				<Text style={styles.btnText}>카카오로 로그인</Text>
			</TouchableOpacity>
		</View>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#E6F0FF'
	},
	kakaoBtn: {
		backgroundColor: '#FEE500',
		padding: 14,
		borderRadius: 8
	},
	btnText: {
		color: '#3C1E1E',
		fontSize: 18,
		fontWeight: 'bold'
	},
	logo: {
		width: '70%',
		height: '50%',
		resizeMode: 'contain'
	},
	webviewContainer: {
		flex: 1,
		backgroundColor: '#fff'
	},
	webview: {
		flex: 1,
		backgroundColor: '#fff'
	},
	loadingOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 2,
		backgroundColor: 'rgba(255,255,255,0.3)'
	}
});

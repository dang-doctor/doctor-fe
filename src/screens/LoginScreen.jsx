import React, { useState, useMemo, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import Config from 'react-native-config';

const LoginScreen = ({ navigation, onLoginSuccess }) => {
	const [showWebView, setShowWebView] = useState(false);
	const webviewRef = useRef(null);

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
			// Android의 일부 케이스에서 URL 파싱이 불안정할 수 있어 fallback
			const q = (url.split('?')[1] || '').split('#')[0];
			return q.split('&').reduce((acc, pair) => {
				const [k, v] = pair.split('=');
				if (!k) return acc;
				acc[decodeURIComponent(k)] = decodeURIComponent(v || '');
				return acc;
			}, {});
		}
	};

	const finishLogin = (payload) => {
		// payload: { token?: string, code?: string, ... }
		// 1) 서버가 REDIRECT_URI에서 곧바로 앱용 토큰(JWT)을 내려주는 경우
		if (payload.token || payload.jwt || payload.app_token) {
			const token = payload.token || payload.jwt || payload.app_token;
			setShowWebView(false);
			onLoginSuccess?.(token);
			return true;
		}
		// 2) 서버가 일회용 코드만 내려주고, 앱이 교환해야 하는 경우
		if (payload.code || payload.app_code) {
			const code = payload.code || payload.app_code;
			setShowWebView(false);
			// 여기서 백엔드로 교환 요청을 보내 토큰을 받은 뒤 onLoginSuccess(token) 호출.
			// 예) await fetch(`${Config.API_BASE}/auth/exchange?code=${encodeURIComponent(code)}`)
			//    -> token 수신 -> onLoginSuccess(token)
			// 이 예시는 설계마다 다르니 실제 엔드포인트에 맞춰 구현하세요.
			// Alert.alert('로그인 성공', '교환 코드 수신. 교환 API를 호출하도록 구현하세요.');
			onLoginSuccess?.({ code });
			return true;
		}
		return false;
	};

	const handleWebViewNavigation = (event) => {
		const { url } = event;

		// 1) 카카오 결과가 서버를 통해 REDIRECT_URI로 돌아옴
		if (KAKAO_REDIRECT_URI && url.startsWith(KAKAO_REDIRECT_URI)) {
			const params = parseQuery(url);
			if (finishLogin(params)) {
				return false; // WebView 진행 중단
			}
			// 쿼리에 결과가 없고, 페이지 내부 스크립트가 postMessage로 보낼 수도 있으니
			// 일단 로드 허용해서 onMessage를 기다릴 수도 있음. 필요에 따라 조정.
			return true;
		}

		// 2) 외부 스킴/인텐트 방어
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
		// REDIRECT_URI 페이지가 아래와 같이 보낼 수 있음:
		// window.ReactNativeWebView.postMessage(JSON.stringify({ type:'LOGIN_OK', token:'...' }))
		try {
			const data = JSON.parse(e?.nativeEvent?.data || '{}');
			if (data?.type === 'LOGIN_OK') {
				if (finishLogin(data)) return;
			}
			if (data?.type === 'LOGIN_FAIL') {
				setShowWebView(false);
				Alert.alert('로그인 실패', data?.message || '알 수 없는 오류');
			}
		} catch {
			// 문자열 등 기타 포맷이면 무시
		}
	};

	if (showWebView) {
		if (!isUrlValid) {
			Alert.alert('설정 오류', 'KAKAO_LOGIN_URL이 비어있거나 잘못되었습니다.');
			setShowWebView(false);
			return null;
		}

		return (
			<View style={styles.webviewContainer}>
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
	}
});

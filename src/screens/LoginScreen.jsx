import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import Config from 'react-native-config';

const LoginScreen = ({ navigation }) => {
	const [showWebView, setShowWebView] = useState(false);

	const KAKAO_LOGIN_URL = Config.KAKAO_LOGIN_URL;

	const handleWebViewNavigation = (event) => {
		const { url } = event;
		if (url.startsWith(Config.KAKAO_REDIRECT_URI)) {
			// 쿼리스트링에서 code 추출 (예: ...?code=xxx)
			const match = url.match(/[?&]code=([^&]+)/);
			if (match) {
				const code = match[1];
				setShowWebView(false);
				navigation.replace('Tabs', { kakaoCode: code });
			} else {
				setShowWebView(false);
				alert('카카오 인증 코드 획득 실패');
			}
			return false;
		}
		return true;
	};
	
	if (showWebView) {
		return (
			<WebView
				source={{ uri: KAKAO_LOGIN_URL }}
				onShouldStartLoadWithRequest={handleWebViewNavigation}
				javaScriptEnabled
				domStorageEnabled
				startInLoadingState
				userAgent="Mozilla/5.0 (Linux; Android 10; Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36"
				onError={syntheticEvent => {
					const { nativeEvent } = syntheticEvent;
					alert('WebView error: ' + nativeEvent.description);
				}}
				onLoadStart={() => console.log('WebView started loading')}
				onLoadEnd={() => console.log('WebView finished loading')}

		  	/>
		);
	}
	
	return (
		<View style={styles.container}>
			<Text style={styles.title}>카카오 로그인</Text>
			<TouchableOpacity
				style={styles.kakaoBtn}
				onPress={() => setShowWebView(true)}
			>
				<Text style={styles.btnText}>카카오로 로그인</Text>
			</TouchableOpacity>
		</View>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	container: { flex:1, justifyContent: 'center', alignItems:'center', backgroundColor:'#fff' },
	title: { fontSize:24, marginBottom: 30 },
	kakaoBtn: { backgroundColor: '#FEE500', padding: 14, borderRadius: 8 },
	btnText: { color:'#3C1E1E', fontSize:18, fontWeight:'bold' }
  });
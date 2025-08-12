// App.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CurvedTabBar from './src/navigations/CurvedTabBar';

import BloodRecordScreen from './src/screens/blood/BloodRecordScreen';
import ChartScreen from './src/screens/chart/ChartScreen';
import MainScreen from './src/screens/main/MainScreen';
import MenuRecordScreen from './src/screens/menu/MenuRecordScreen';
import CameraScreen from './src/screens/main/CameraScreen';

import LoginScreen from './src/screens/LoginScreen';

const TAB_SCREENS = {
	main: MainScreen,
	blood: BloodRecordScreen,
	menu: MenuRecordScreen,
	chart: ChartScreen,
};

const Stack = createStackNavigator();

const TabScreens = ({ activeKey, setActiveKey, route }) => {
	const ActiveScreen = TAB_SCREENS[activeKey];
	// 로그인 직후 전달받은 코드(있을 수도, 없을 수도)z
	const kakaoCode = route?.params?.kakaoCode ?? null;
	console.log(kakaoCode);

	// 필요하다면 여기서 kakaoCode로 백엔드에 신호 보내거나
	// 한 번 사용 후 무시하는 로직을 넣을 수 있음.

	return (
		<>
			<View style={styles.container}>
				<ActiveScreen />
			</View>
			<CurvedTabBar activeKey={activeKey} onTabPress={setActiveKey} />
		</>
	);
};

const App = () => {
	const [activeKey, setActiveKey] = useState('main');
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [pendingAuth, setPendingAuth] = useState(null); // { token?: string, code?: string }

	useEffect(() => {
		const checkSession = async () => {
			try {
				const token = await AsyncStorage.getItem('app_access_token');
				setIsLoggedIn(!!token);
			} catch (e) {
				setIsLoggedIn(false);
			} finally {
				setIsLoading(false);
			}
		};
		checkSession();
	}, []);

	// LoginScreen에서 성공 신호 수신 (토큰 또는 코드)
	const handleLoginSuccess = useCallback(async (payload) => {
		try {
			let token = null;
			let code = null;

			if (typeof payload === 'string') {
				// 문자열이면 토큰으로 간주
				token = payload;
			} else if (payload && typeof payload === 'object') {
				token = payload.token || payload.jwt || payload.app_token || null;
				code = payload.code || payload.app_code || null;
			}

			// 토큰이 있으면 저장 → 로그인 완료
			if (token) {
				await AsyncStorage.setItem('app_access_token', token);
			}

			// 코드만 왔다면 저장은 건너뛰고 Tabs로 진입하면서 코드만 넘김
			setPendingAuth({ token, code });

			// 로그인 상태 전환 → Stack이 재마운트되며 Tabs로 진입
			setIsLoggedIn(true);
		} catch (e) {
			console.warn('Login finalize error:', e?.message || e);
			setIsLoggedIn(false);
			setPendingAuth(null);
		}
	}, []);

	if (isLoading) return null; // 필요 시 Splash로 교체

	return (
		<SafeAreaProvider>
			<NavigationContainer>
				{/* isLoggedIn 변경 시 초기 라우트 반영 위해 재마운트 */}
				<Stack.Navigator
					key={isLoggedIn ? 'loggedIn' : 'guest'}
					initialRouteName={isLoggedIn ? 'Tabs' : 'Login'}
					screenOptions={{ headerShown: false }}
				>
					<Stack.Screen name="Login">
						{(props) => (
							<LoginScreen
								{...props}
								onLoginSuccess={handleLoginSuccess}
							/>
						)}
					</Stack.Screen>

					<Stack.Screen
						name="Tabs"
						// 로그인 직후 1회성으로 코드 전달 (없으면 null)
						initialParams={{ kakaoCode: pendingAuth?.code ?? null }}
					>
						{(props) => (
							<TabScreens
								{...props} // route, navigation 전달
								activeKey={activeKey}
								setActiveKey={setActiveKey}
							/>
						)}
					</Stack.Screen>

					<Stack.Screen name="CameraScreen" component={CameraScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#E6F0FF',
	},
});

export default App;

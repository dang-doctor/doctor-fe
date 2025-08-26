// App.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // npm install 필요(v6)
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 커스텀 탭바 어댑터 (분리 파일)
import CurvedTabBarAdapter from './src/navigations/CurvedTabBarAdapter';

// 탭1: 메인
import MainScreen from './src/screens/main/MainScreen';
import CameraScreen from './src/screens/main/CameraScreen';
// import CameraResultScreen from './src/screens/main/CameraResultScreen'; // 있다면 주석 해제

// 탭2: 혈당
import BloodRecordScreen from './src/screens/blood/BloodRecordScreen';
import BloodSugarAddScreen from './src/screens/blood/BloodSugarAddScreen';
// import BloodSugarEditScreen from './src/screens/blood/BloodSugarEditScreen'; // 있다면 주석 해제

// 탭3: 식단 정보
import MenuRecordScreen from './src/screens/menu/MenuRecordScreen';
// import FoodDetailScreen from './src/screens/menu/FoodDetailScreen'; // 있다면 주석 해제

// 탭4: 통계/마이페이지
import ChartScreen from './src/screens/chart/ChartScreen';
// import ProfileScreen from './src/screens/profile/ProfileScreen'; // 있다면 주석 해제

// 인증
import LoginScreen from './src/screens/LoginScreen';
import { SessionProvider } from './src/session/SessionProvider';
import RenderTest from './RenderTest';
// import { SessionProvider } from './src/session/SessionProvider'; // 세션 컨텍스트가 필요하면 주석 해제

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/* ─────────────────────────────────────────────
 * 탭별 스택들
 * ───────────────────────────────────────────── */
const MainStack = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="MainHome" component={MainScreen} />
			<Stack.Screen name="CameraScreen" component={CameraScreen} />
			{/* <Stack.Screen name="CameraResult" component={CameraResultScreen} /> */}
		</Stack.Navigator>
	);
};

const BloodStack = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="BloodHome" component={BloodRecordScreen} />
			<Stack.Screen name="BloodSugarAddScreen" component={BloodSugarAddScreen} />
			{/* <Stack.Screen name="BloodSugarEditScreen" component={BloodSugarEditScreen} /> */}
		</Stack.Navigator>
	);
};

const MenuStack = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="MenuHome" component={MenuRecordScreen} />
			{/* <Stack.Screen name="FoodDetail" component={FoodDetailScreen} /> */}
		</Stack.Navigator>
	);
};

const ChartStack = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="ChartHome" component={ChartScreen} />
			{/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
		</Stack.Navigator>
	);
};

/* ─────────────────────────────────────────────
 * 탭 네비게이터(커스텀 CurvedTabBar 장착)
 * - name은 TABS.key와 동일: "main" | "blood" | "menu" | "chart"
 * - kakaoCode가 있다면 초기 1회성으로 탭 스크린들에 전달(필요시 활용)
 * ───────────────────────────────────────────── */
const AppTabs = ({ initialKakaoCode = null }) => {
	return (
		<Tab.Navigator
			screenOptions={{ headerShown: false }}
			tabBar={(props) => <CurvedTabBarAdapter {...props} />}
		>
			<Tab.Screen
				name="main"
				component={MainStack}
				initialParams={{ kakaoCode: initialKakaoCode }}
			/>
			<Tab.Screen
				name="blood"
				component={BloodStack}
				initialParams={{ kakaoCode: initialKakaoCode }}
			/>
			<Tab.Screen
				name="menu"
				component={MenuStack}
				initialParams={{ kakaoCode: initialKakaoCode }}
			/>
			<Tab.Screen
				name="chart"
				component={ChartStack}
				initialParams={{ kakaoCode: initialKakaoCode }}
			/>
		</Tab.Navigator>
	);
};

/* ─────────────────────────────────────────────
 * 루트(App): 로그인 세션 확인 → 스택 분기
 * - isLoggedIn: AsyncStorage('app_access_token') 유무로 판단
 * - handleLoginSuccess: 토큰/코드 수신시 저장 및 탭으로 전환
 * - pendingAuth.code는 Tabs로 1회 전달
 * ───────────────────────────────────────────── */
const App = () => {
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

	const handleLoginSuccess = useCallback(async (payload) => {
		try {
			let token = null;
			let code = null;

			if (typeof payload === 'string') {
				token = payload;
			} else if (payload && typeof payload === 'object') {
				token = payload.token || payload.jwt || payload.app_token || null;
				code = payload.code || payload.app_code || null;
			}

			if (token) {
				await AsyncStorage.setItem('app_access_token', token);
			}

			setPendingAuth({ token, code });
			setIsLoggedIn(true);
		} catch (e) {
			console.warn('Login finalize error:', e?.message || e);
			setIsLoggedIn(false);
			setPendingAuth(null);
		}
	}, []);

	if (isLoading) return null; // 스플래시가 필요하면 여기서 렌더

	return (
		// <RenderTest />
		<SessionProvider> 
			<SafeAreaProvider>
				<SafeAreaView style={{ flex: 1 }}>
					<StatusBar backgroundColor="#fff" barStyle="dark-content" />
					<NavigationContainer>
						<Stack.Navigator
							key={isLoggedIn ? 'loggedIn' : 'guest'} // 상태 전환 시 초기 라우트 재평가
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

							<Stack.Screen name="Tabs">
								{() => (
									<AppTabs
										initialKakaoCode={pendingAuth?.code ?? null}
									/>
								)}
							</Stack.Screen>
						</Stack.Navigator>
					</NavigationContainer>
				</SafeAreaView>
			</SafeAreaProvider>
		</SessionProvider>
	);
};

export default App;
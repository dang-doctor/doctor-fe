// RenderTest.jsx
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';	// (v6) 미설치 시 npm install @react-navigation/bottom-tabs
import { createStackNavigator } from '@react-navigation/stack';

// 커스텀 탭바 어댑터 (CameraScreen에서 탭바 숨김 로직 포함)
import CurvedTabBarAdapter from './src/navigations/CurvedTabBarAdapter';

// 탭1: 메인
import MainScreen from './src/screens/main/MainScreen';
import CameraScreen from './src/screens/main/CameraScreen';
import FoodInfoScreen from './src/screens/main/FoodInfoScreen';

// 탭2: 혈당
import BloodRecordScreen from './src/screens/blood/BloodRecordScreen';
import BloodSugarAddScreen from './src/screens/blood/BloodSugarAddScreen';

// 탭3: 식단 정보
import MenuRecordScreen from './src/screens/menu/MenuRecordScreen';

// 탭4: 통계/마이페이지
import ChartScreen from './src/screens/chart/ChartScreen';
import MyPageScreen from './src/screens/chart/MyPageScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/* ─────────────────────────────────────────────
 * 스택 네비게이터들
 * ───────────────────────────────────────────── */
const MainStack = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="MainHome" component={MainScreen} />
			<Stack.Screen name="CameraScreen" component={CameraScreen} />
			<Stack.Screen name="FoodInfoScreen" component={FoodInfoScreen} />
		</Stack.Navigator>
	);
};

const BloodStack = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="BloodHome" component={BloodRecordScreen} />
			<Stack.Screen name="BloodSugarAddScreen" component={BloodSugarAddScreen} />
		</Stack.Navigator>
	);
};

const MenuStack = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="MenuHome" component={MenuRecordScreen} />
		</Stack.Navigator>
	);
};

const ChartStack = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="ChartHome" component={ChartScreen} />
			<Stack.Screen name="MyPageScreen" component={MyPageScreen} />
		</Stack.Navigator>
	);
};

/* ─────────────────────────────────────────────
 * 탭 네비게이터 (커스텀 CurvedTabBar 장착)
 * ───────────────────────────────────────────── */
const AppTabs = () => {
	return (
		<Tab.Navigator
			screenOptions={{ headerShown: false }}
			tabBar={(props) => <CurvedTabBarAdapter {...props} />}
		>
			<Tab.Screen name="main" component={MainStack} />
			<Tab.Screen name="blood" component={BloodStack} />
			<Tab.Screen name="menu" component={MenuStack} />
			<Tab.Screen name="chart" component={ChartStack} />
		</Tab.Navigator>
	);
};

/* ─────────────────────────────────────────────
 * 최상위 컨테이너 (로그인 분기 제거 버전)
 * ───────────────────────────────────────────── */
const RenderTest = () => {
	return (
		<SafeAreaProvider>
			<SafeAreaView style={{ flex: 1 }}>
				<StatusBar backgroundColor="#fff" barStyle="dark-content" />
				<NavigationContainer>
					<AppTabs />
				</NavigationContainer>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};

export default RenderTest;
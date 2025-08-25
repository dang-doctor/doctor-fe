// RenderTest.jsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // npm install 필요
import { createStackNavigator } from '@react-navigation/stack';

// 기존 컴포넌트들
import CurvedTabBar from './src/navigations/CurvedTabBar';
import MainScreen from './src/screens/main/MainScreen';
import BloodRecordScreen from './src/screens/blood/BloodRecordScreen';
import BloodSugarAddScreen from './src/screens/blood/BloodSugarAddScreen';
import MenuRecordScreen from './src/screens/menu/MenuRecordScreen';
import ChartScreen from './src/screens/chart/ChartScreen';

// (중요) 네이밍: Tab.Screen의 name을 TABS.key(예: 'main', 'blood', 'menu', 'chat')와 맞추자.
// 현재 상수는 { main, blood, menu, chat } 구조였음.
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/* ─────────────────────────────────────────────
 * CurvedTabBarAdapter: react-navigation <-> CurvedTabBar 연결
 * - CurvedTabBar는 기존처럼 activeKey / setActiveKey / onTabPress 로만 동작
 * - 어댑터에서 state/navigation을 받아 키 매핑 후 전달
 * ───────────────────────────────────────────── */
const CurvedTabBarAdapter = ({ state, navigation }) => {
	const routes = state.routes; // [{ key, name }]
	const index = state.index;
	const activeKey = routes[index].name; // 'main' | 'blood' | 'menu' | 'chat'

	const handleTabPress = (key) => {
		if (key !== activeKey) {
			navigation.navigate(key);
		}
	};

	return (
		<CurvedTabBar
			activeKey={activeKey}
			onTabPress={handleTabPress}
		/>
	);
};

/* ─────────────────────────────────────────────
 * 각 탭 = 자체 스택
 * 필요 스크린만 우선 배치 (나중에 카메라/결과/프로필 등 추가 가능)
 * ───────────────────────────────────────────── */
const MainStack = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="MainHome" component={MainScreen} />
			{/*
				예: 카메라/결과 등의 후속 화면이 생기면 아래처럼 추가
				<Stack.Screen name="Camera" component={CameraScreen} />
				<Stack.Screen name="CameraResult" component={CameraResultScreen} />
			*/}
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
			{/*
				예: 마이페이지 등
				<Stack.Screen name="Profile" component={ProfileScreen} />
			*/}
		</Stack.Navigator>
	);
};

/* ─────────────────────────────────────────────
 * 루트: 탭 네비게이터
 * CurvedTabBar는 tabBar={(props) => <CurvedTabBarAdapter {...props} />}로 장착
 * ───────────────────────────────────────────── */
const RenderTest = () => {
	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<Tab.Navigator
					screenOptions={{ headerShown: false }}
					tabBar={(props) => <CurvedTabBarAdapter {...props} />}
					// 필요시 초기 탭 지정: initialRouteName="blood"
				>
					<Tab.Screen name="main" component={MainStack} />
					<Tab.Screen name="blood" component={BloodStack} />
					<Tab.Screen name="menu" component={MenuStack} />
					<Tab.Screen name="chart" component={ChartStack} />
				</Tab.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	);
};

const styles = StyleSheet.create({
	// 필요 시 전역 스타일
});

export default RenderTest;

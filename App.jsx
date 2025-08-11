// App.jsx
import React, { useEffect, useState } from 'react';
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

const TabScreens = ({ activeKey, setActiveKey }) => {
	const ActiveScreen = TAB_SCREENS[activeKey];
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

	useEffect(() => {
		const checkSession = async () => {
			try {
				const token = await AsyncStorage.getItem('kakao_access_token');
				setIsLoggedIn(!!token);
			} catch (e) {
				setIsLoggedIn(false);
			} finally {
				setIsLoading(false);
			}
		};
		checkSession();
	}, []);

	if (isLoading) return null; // 필요 시 Splash 컴포넌트로 교체

	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<Stack.Navigator screenOptions={{ headerShown: false }}>
					{!isLoggedIn ? (
						<Stack.Screen name="Login">
							{(props) => (
								<LoginScreen
									{...props}
									onLoginSuccess={async (token) => {
										try {
											await AsyncStorage.setItem('kakao_access_token', token);
										} catch (e) {}
										setIsLoggedIn(true);
									}}
								/>
							)}
						</Stack.Screen>
					) : (
						<Stack.Screen name="Tabs">
							{() => (
								<TabScreens
									activeKey={activeKey}
									setActiveKey={setActiveKey}
								/>
							)}
						</Stack.Screen>
					)}
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

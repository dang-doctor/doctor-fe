import React, { useState } from 'react';
import MainScreen from './src/screens/main/MainScreen';
import BloodRecordScreen from './src/screens/blood/BloodRecordScreen';
import MenuRecordScreen from './src/screens/menu/MenuRecordScreen';
import ChartScreen from './src/screens/chart/ChartScreen';
import { StyleSheet, View } from 'react-native';
import CurvedTabBar from './src/navigations/CurvedTabBar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const TAB_SCREENS = {
	main : MainScreen,
	blood : BloodRecordScreen,
	menu : MenuRecordScreen,
	chat : ChartScreen,
};

const TabScreens = ({ activeKey, setActiveKey }) => {
	const ActiveScreen = TAB_SCREENS[activeKey];
	return (
		<>
			<View style={styles.container}>
				<ActiveScreen />
			</View>
			<CurvedTabBar activeKey={activeKey} setActiveKey={setActiveKey} />
		</>
	);
};

const RenderTest = () => {
	const [activeKey, setActiveKey] = useState('blood');

	const handleTabPress = (key) => {
		setActiveKey(key);
	};

	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<TabScreens activeKey={activeKey} setActiveKey={setActiveKey} />
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

export default RenderTest;
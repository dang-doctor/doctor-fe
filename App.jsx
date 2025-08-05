import { NewAppScreen } from '@react-native/new-app-screen';
import { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import CurvedTabBar from './src/navigations/CurvedTabBar';
import Colors from './src/constants/colors';

import BloodRecordScreen from './src/screens/BloodRecordScreen';
import ChartScreen from './src/screens/ChartScreen';
import MainScreen from './src/screens/MainScreen';
import MenuRecordScreen from './src/screens/MenuRecordScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const TAB_SCREENS = {
	main: MainScreen,
	blood: BloodRecordScreen,
	menu: MenuRecordScreen,
	chart: ChartScreen,
};

function App() {
	const colorScheme = useColorScheme();

	const [activeKey, setActiveKey] = useState("main");
	const ActiveScreen = TAB_SCREENS[activeKey];
	// const theme = Colors[colorScheme ?? 'white'];

	return (
		<SafeAreaProvider>
			<View style={styles.container}>
				<ActiveScreen />
			</View>
			<CurvedTabBar activeKey={activeKey} onTabPress={setActiveKey} />
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#E6F0FF",
	},
});

export default App;
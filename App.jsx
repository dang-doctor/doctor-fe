import { NewAppScreen } from '@react-native/new-app-screen';
import { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import CurvedTabBar from './src/navigations/CurvedTabBar';

function App() {
	const isDarkMode = useColorScheme() === 'dark';

	const [activeKey, setActiveKey] = useState("camera");

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#afafaf" }}>
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text style={{ fontSize: 36, color: "#333" }}> 화면</Text>
			</View>
			<CurvedTabBar activeKey={activeKey} onTabPress={setActiveKey} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default App;

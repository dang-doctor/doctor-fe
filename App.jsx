import { NewAppScreen } from '@react-native/new-app-screen';
import { useState } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import CurvedTabBar from './src/navigations/CurvedTabBar';

import BloodRecordScreen from './src/screens/BloodRecordScreen';
import ChartScreen from './src/screens/ChartScreen';
import MainScreen from './src/screens/MainScreen';
import MenuRecordScreen from './src/screens/MenuRecordScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CameraScreen from './src/screens/main/CameraScreen';

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

function App() {
	const colorScheme = useColorScheme();

	const [activeKey, setActiveKey] = useState("main");
	// const theme = Colors[colorScheme ?? 'white'];

	return (
		<SafeAreaProvider>
			<NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {/* Tab 화면은 하나의 컴포넌트로 묶어서 보여줌 */}
                    <Stack.Screen name="Tabs">
                        {() => <TabScreens activeKey={activeKey} setActiveKey={setActiveKey} />}
                    </Stack.Screen>
                    {/* 하위 페이지 등록 */}
                    <Stack.Screen name="CameraScreen" component={CameraScreen} />
                    {/* 필요하다면 더 추가 */}
                </Stack.Navigator>
            </NavigationContainer>
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
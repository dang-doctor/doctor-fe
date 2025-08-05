import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MainScreen = () => {

	const insets = useSafeAreaInsets();

	return (
		<View style={[styles.screenContainer, {paddingTop: insets.top,}]}>
			<Text style={styles.mainText}>오늘의 식단을{'\n'}등록해주세요</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	screenContainer: {
		// alignItems: "flex-start",
		justifyContent: "flex-start",
		width: "100%",
		height: "100%",
	},
	mainText: {
		// textAlign: "",
		fontFamily: "Cafe24Ssukssuk-v2.0",
		fontSize: 35,
		color: "#126EB1",
		width: "100%",
		paddingLeft: "40",
		paddingTop: "50",
	},
});

export default MainScreen;
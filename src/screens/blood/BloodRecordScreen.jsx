import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BloodRecordScreen = () => {
	const insets = useSafeAreaInsets();
	return (
		<View style={styles.screenContainer}>
			<View style={styles.topBar}>
				<Text>M/D</Text>
			</View>
			<Text> 혈당 추가 </Text>
		</View>
	);
};

const styles = StyleSheet.create({
	screenContainer: {
		width: "100%",
		height: "100%",
	},
	topBar: {
		width: "100%",
		height: 50,
		backgroundColor: "#fff",
	},
})

export default BloodRecordScreen;
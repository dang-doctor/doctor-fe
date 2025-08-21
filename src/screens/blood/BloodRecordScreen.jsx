import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TextDateSelector from '../../components/TextDateSelector';

const BloodRecordScreen = () => {
	const insets = useSafeAreaInsets();
	const [picked, setPicked] = useState(null);

	return (
		<View style={[styles.screenContainer, {paddingTop: insets.top,}]}>
			<View style={styles.topBar}>
				<TextDateSelector
					initialDate={new Date()}
					onChange={(d) => setPicked(d)}
				/>
			</View>
			<Text style={styles.topLabel}>오늘 하루 </Text>
			<Text style={styles.totalCalLabel}>
				<Text style={styles.calLabel}>{0}</Text> / 1234 kcal
			</Text>
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
		height: 60,
		backgroundColor: "#fff",
		textAlign: "center",
		justifyContent: "center",
	},
	topLabel: {
		fontSize: 20,
		fontFamily: "ONE Mobile POP OTF",
		padding: 20,
	},
	calLabel: {
		color: "black",
	},
	totalCalLabel: {
		color: "#929EFF",
		fontFamily: "ONE Mobile POP OTF",
		fontSize: 30,
		textAlign: 'center',
	},
})

export default BloodRecordScreen;
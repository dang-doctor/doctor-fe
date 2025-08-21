import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TextDateSelector from '../../components/TextDateSelector';
import DateHeader from '../../components/DateHeader';

const MAIN_FONT = 'ONE Mobile POP OTF';

const BloodRecordScreen = () => {
	const insets = useSafeAreaInsets();
	// const [picked, setPicked] = useState(null);

	const [selectedDate, setSelectedDate] = useState(new Date());
	const [sugarRatio, setSugarRatio] = useState(0);
	
	return (
		<View style={[styles.screenContainer, {paddingTop: insets.top,}]}>
			<View style={styles.topContainer}>
				<DateHeader
					initialDate={selectedDate}
					onDateChange={(date) => {
						setSelectedDate(date);
					}}
				/>
				<Text style={styles.topLabel}>오늘 하루 </Text>
				<Text style={styles.totalCalLabel}>
					<Text style={styles.calLabel}>{0}</Text> / 1234 kcal
				</Text>
				<View style={styles.sugarLabel}>
					<Text style={styles.sugarLabelPoint}>당</Text>
					<Text style={styles.sugarRatio}> {sugarRatio}%</Text>
				</View>
				
			</View>
			<View style={styles.bottomContainer}>

			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	screenContainer: {
		width: "100%",
		height: "100%",
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingBottom: 120,
	},
	topBar: {
		width: "100%",
		height: 60,
		backgroundColor: "#fff",
		textAlign: "center",
		justifyContent: "center",
	},
	topContainer: {
		width: '100%',
	},
	topLabel: {
		fontSize: 20,
		fontFamily: MAIN_FONT,
		padding: 20,
	},
	calLabel: {
		color: "black",
	},
	totalCalLabel: {
		color: "#929EFF",
		fontFamily: MAIN_FONT,
		fontSize: 30,
		textAlign: 'center',
	},
	sugarLabel: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 40,
	},
	sugarLabelPoint: {
		fontSize: 18,
		fontFamily: MAIN_FONT,
		color: '#929EFF',
		backgroundColor: '#fff',
		textAlign: 'center',
		padding: 5,
		borderRadius: 50,
		width: 30,
		aspectRatio: 1,
	},
	sugarRatio: {
		fontSize: 20,
		fontFamily: MAIN_FONT,
	},
	bottomContainer: {
		backgroundColor: '#B7D4FF',
		width: '90%',
		height: 400,
		borderRadius: 10,
	},
})

export default BloodRecordScreen;
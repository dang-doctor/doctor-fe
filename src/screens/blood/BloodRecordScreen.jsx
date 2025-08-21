import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateHeader from '../../components/DateHeader';
import { Grid, Row, Col } from 'react-native-easy-grid';
import BloodSugarRegister from '../../components/BloodSugarRegister';

import WakeUp from '../../assets/svgs/wakeup.svg';

const MAIN_FONT = 'ONE Mobile POP OTF';

const BloodRecordScreen = () => {
	const insets = useSafeAreaInsets();

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
				<Text style={styles.bottomLabel}>혈당</Text>
				<Grid style={styles.grid}>
					<Row>
						<Col style={styles.col}>
							<BloodSugarRegister icon='wakeup' />
						</Col>
						<Col style={styles.col}>
							<BloodSugarRegister icon='morning' />
						</Col>
					</Row>
					<Row>
						<Col style={styles.col}>
							<BloodSugarRegister icon='noon' />
						</Col>
						<Col style={styles.col}>
							<BloodSugarRegister icon='evening' />
						</Col>
					</Row>
				</Grid>
			</View>
			<Image
				pointerEvents="none"
				source={require('../../assets/images/character_inBloodScreen.png')}
				style={styles.charImg}	
			/>
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
		position: 'relative',
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
		zIndex: 2,
		elevation: 2,
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
		paddingTop: 20,
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
	charImg: {
		position: 'absolute',
		top: 0,
		right: 10,
		width: '20%',
		resizeMode: 'contain',
		zIndex: 0,
	},
	bottomContainer: {
		backgroundColor: '#B7D4FF',
		width: '90%',
		height: 400,
		borderRadius: 10,
	},
	bottomLabel: {
		padding: 24,
		fontFamily: MAIN_FONT,
		color: '#fff',
		fontSize: 20,
	},
	grid: {
		paddingTop: 0,
		paddingBottom: 20,
		paddingHorizontal: 20,
		
	},
	col: {
		padding: 10,
	},
})

export default BloodRecordScreen;
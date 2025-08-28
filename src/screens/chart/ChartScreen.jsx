import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/colors';
import Config from 'react-native-config';

const API_URL = Config.API_BASE_URL;
const MAIN_FONT = 'ONE Mobile POP OTF';
const BGCOLOR = Colors.key.background;

const ChartScreen = () => {
	
	const [mode, setMode] = useState('week');

	return (
		<View style={styles.container}>
			<Text style={styles.headerText}>식단 정보</Text>
			<View style={styles.modeToggleRow}>
				<TouchableOpacity
					style={[styles.modeButton, mode === 'week' ? styles.modeButtonActive : styles.modeButtonInactive]}
					onPress={()=> setMode('week')}
				>
					<Text style={[styles.modeButtonText, mode === 'week' ? styles.modeButtonTextActive : styles.modeButtonTextInactive]}>주</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.modeButton, mode === 'month' ? styles.modeButtonActive : styles.modeButtonInactive]}
					onPress={()=> setMode('month')}
				>
					<Text style={[styles.modeButtonText, mode === 'month' ? styles.modeButtonTextActive : styles.modeButtonTextInactive]}>월</Text>
				</TouchableOpacity>
			</View>
			

		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: BGCOLOR,
	},
	headerText: {
		fontFamily: MAIN_FONT,
		fontSize: 20,
		color: '#111',
		backgroundColor: '#fff',
		width: '100%',
		height: 60,
		textAlignVertical: 'center',
		paddingLeft: 20,
	},
	modeToggleRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		paddingVertical: 12,
		backgroundColor: '#fff',
	},
	modeButton: {
		minWidth: 140,
		height: 44,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modeButtonActive: {
		backgroundColor: '#6d8cff',
	},
	modeButtonInactive: {
		backgroundColor: '#d7dbe9',
	},
	modeButtonText: {
		fontFamily: MAIN_FONT,
		fontSize: 16,
	},
	modeButtonTextActive: { color: '#fff' },
	modeButtonTextInactive: { color: '#8089a7' },
});

export default ChartScreen;
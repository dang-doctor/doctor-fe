import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';

const MAIN_FONT = 'ONE Mobile POP OTF';


const BloodSugarAddScreen = ({ route }) => {
	const [time, setTime] = useState(() => route?.params?.initialOption ?? 'wakeup');

	return (
		<View>
			<Text style={styles.headerText} >혈당 추가</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	headerText: {
		fontFamily: MAIN_FONT,
		fontSize: 20,
		color: '#111',
		backgroundColor: '#fff',
		width: '100%',
		height: 60,
		textAlignVertical: 'center',
		paddingLeft: 20,

	}

});


export default BloodSugarAddScreen;

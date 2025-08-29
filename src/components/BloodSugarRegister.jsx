import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import PlusButton from './PlusButton';

const MAIN_FONT = 'ONE Mobile POP OTF';

const icons = {
	wakeup: require('../assets/images/wakeup.png'),
	morning: require('../assets/images/morning.png'),
	noon: require('../assets/images/noon.png'),
	evening: require('../assets/images/evening.png'),
}

const texts ={
	wakeup: '기상직후',
	morning: '아침',
	noon: '점심',
	evening: '저녁',
}

const BloodSugarRegister = ({ icon, value, onPress }) => {
	// 혈당 값이 있으면 표시, 없으면 "측정 안함" 표시
	const displayValue = value !== null && value !== undefined ? value : '측정 안함';
	const hasValue = value !== null && value !== undefined;

	return (
		<View style={styles.box}>
			<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
				<View style={styles.iconWrapper}>
					<Image
						source={icons[icon]}
						style={styles.icon}
					/>
					<Text style={styles.iconText}>{texts[icon]}</Text>
				</View>
				<PlusButton size={40} strokeWidth={4} onPress={onPress}/>
			</View>
			<Text style={[styles.sugarAmount, !hasValue && styles.noValue]}>
				<Text style={[styles.sugarValue, !hasValue && styles.noValueText]}>
					{displayValue}
				</Text>
				{hasValue && ' mg/dL'}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	box: {
		width: '100%',
		height: '100%',
		backgroundColor: '#6E92FF',
		borderRadius: 10,
		paddingHorizontal: 15,
		paddingVertical: 18,
		justifyContent: 'space-between',
	},
	icon: {
		width: 40,
		height: 30,
		resizeMode: 'contain',
		marginHorizontal: 5,
		marginBottom: 10,
	},
	iconText: {
		fontFamily: MAIN_FONT,
		color: '#fff',
		width: 50,
		fontSize: 14,
		textAlign: 'center',
	},
	sugarAmount: {
		width: '100%',
		lineHeight: 24,
		textAlign: 'center',
		fontSize: 12,
		fontFamily: MAIN_FONT,
		color: '#fff',
	},
	sugarValue: {
		fontSize: 24,
	},
	noValue: {
		opacity: 0.7,
	},
	noValueText: {
		fontSize: 16,
	},
});

export default BloodSugarRegister;
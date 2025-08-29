import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const FONT = 'Cafe24Ssukssuk-v2.0';

const ChartCharcterCard = ({ condition }) => {
	const sentence = {
		good: '건강한 선택이\n쌓여 멋진 결과를\n만들고 있어요!',
		bad: '노력한 만큼 변화는\n쌓이고 있어요\n이번주는\n잠시 쉬어간 거예요.'
	};
	const imgSource = {
		good: require('../assets/images/chartscreen_good.png'),
		bad: require('../assets/images/chartscreen_bad.png')
	};
	return (
		<View style={styles.container}>
			<Text style={styles.text}>{sentence[condition]}</Text>
			<Image
				source={imgSource[condition]}
				style={styles.img}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		backgroundColor: '#fff',
		borderRadius: 16,
		flexDirection: 'row', 
		padding: '30',
		justifyContent: 'space-between',
		margin: 10,
	},
	text: {
		fontFamily: FONT,
		fontSize: 24,
		color: '#126EB1',
	},
	img: {
		width: '60%',
		height: '120%',
		resizeMode: 'contain',
	},
});

export default ChartCharcterCard;
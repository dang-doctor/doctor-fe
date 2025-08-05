import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MainScreen = () => {

	const insets = useSafeAreaInsets();

	return (
		<View style={[styles.screenContainer, {paddingTop: insets.top,}]}>
			<Text style={styles.mainText}>오늘의 식단을{'\n'}등록해주세요</Text>
			<View style= {styles.cloudImgWrapper}>
				<Image 
					source={require('../assets/images/cloud.png')}
					style={styles.cloudImg}
				/>
			</View>
			<View style={styles.charImgWrapper}>
				<Image
					source={require('../assets/images/character.png')}
					style={styles.characterImg}
				/>
			</View>
		</View>
	);
};

// TODO : Wrapper 2개를 묶고, screen을 space-between으로 설정,
// 그러면 글자는 맨 위, 이미지 두개는 아래로 정렬,
// 그 상태에서 이미지 크기 다시 조절해보기.

const styles = StyleSheet.create({
	screenContainer: {
		// flex: 3,
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
	cloudImgWrapper: {
		padding: 0,
		margin: 0,
		width: "100%",
		height: "40%",
		alignItems: "center",
		justifyContent: "flex-end",
	},
	cloudImg: {
		margin: 0,
		width: "80%",
		height: "60%",
		resizeMode: "contain",
	},
	charImgWrapper: {
		width: "100%",
		height: "40%",
		alignItems: "center",
		justifyContent: 'flex-start',
	},
	characterImg: {
		width: "80%",
		height: "80%",
		resizeMode: "contain",
	},
	
});

export default MainScreen;
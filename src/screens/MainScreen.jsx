import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CameraScreen from './main/CameraScreen';
import { useNavigation } from '@react-navigation/native';

const MainScreen = () => {

	const insets = useSafeAreaInsets();

	const navigation = useNavigation();

	return (
		<View style={[styles.screenContainer, {paddingTop: insets.top,}]}>
			<Text style={styles.mainText}>오늘의 식단을{'\n'}등록해주세요</Text>
			<View>
				<TouchableOpacity
					style={styles.cloudImgWrapper}
					onPress={ ()=>{navigation.navigate('CameraScreen')} }
				>
					<Image
						source={require('../assets/images/cloud.png')}
						style={styles.cloudImg}
					/>
				</TouchableOpacity>
				<View style={styles.charImgWrapper}>
					<Image
						source={require('../assets/images/character.png')}
						style={styles.characterImg}
					/>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	screenContainer: {
		// flex: 3,
		justifyContent: "space-between",
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
		paddingTop: "65",
	},
	viewContainer: {
		flex: 2,
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
		height: "45%",
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
// MainScreen.jsx
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../constants/colors.js';

const BGCOLOR = Colors.key.background;
// 커스텀 탭바 높이를 알고 있다면 설정(예: 72)
const TABBAR_H = 72;

const MainScreen = () => {
	const insets = useSafeAreaInsets();
	const navigation = useNavigation();

	return (
		<View style={[styles.screenContainer, { paddingTop: insets.top }]}>
			<Text style={styles.mainText}>오늘의 식단을{'\n'}등록해주세요</Text>

			<View>
				<TouchableOpacity
					style={styles.cloudImgWrapper}
					onPress={() => { navigation.navigate('CameraScreen'); }}
				>
					<Image
						source={require('../../assets/images/cloud.png')}
						style={styles.cloudImg}
					/>
				</TouchableOpacity>

				<View style={styles.charImgWrapper}>
					<Image
						source={require('../../assets/images/character.png')}
						style={styles.characterImg}
					/>
				</View>
			</View>

			<View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
				<TouchableOpacity
					activeOpacity={0.9}
					onPress={() => { navigation.navigate('RecordScreen'); }}
					style={[
						styles.fab,
						{
							bottom: insets.bottom + TABBAR_H + 16,	// 탭바/홈 인디케이터와 간섭 방지
							right: 20,
						},
					]}
					hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
				>
					<Text style={styles.fabText}>기록</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
		position: 'relative',					// ⬅️ 오버레이 기준
		justifyContent: 'space-between',
		width: '100%',
		height: '100%',
		backgroundColor: BGCOLOR,
	},
	mainText: {
		fontFamily: 'Cafe24Ssukssuk-v2.0',
		fontSize: 35,
		color: '#126EB1',
		width: '100%',
		paddingLeft: 40,						// 숫자로!
		paddingTop: 65,							// 숫자로!
	},
	viewContainer: {
		flex: 2,
	},
	cloudImgWrapper: {
		padding: 0,
		margin: 0,
		width: '100%',
		height: '40%',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	cloudImg: {
		margin: 0,
		width: '80%',
		height: '60%',
		resizeMode: 'contain',
	},
	charImgWrapper: {
		width: '100%',
		height: '45%',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	characterImg: {
		width: '80%',
		height: '80%',
		resizeMode: 'contain',
	},

	// ✅ 기록 버튼 스타일
	fab: {
		position: 'absolute',
		minWidth: 64,
		height: 64,
		paddingHorizontal: 20,
		borderRadius: 32,
		backgroundColor: '#FFFFFF',
		alignItems: 'center',
		justifyContent: 'center',
		// iOS shadow
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 6 },
		// Android shadow
		elevation: 1,
		zIndex: 20,								// 마스코트/클라우드보다 위
	},
	fabText: {
		fontSize: 20,
		fontFamily: 'ONE Mobile POP OTF',
		color: '#7B7BEA',
	},
});

export default MainScreen;
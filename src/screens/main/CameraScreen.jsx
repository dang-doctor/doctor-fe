import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';

const CameraScreen = ({ navigation }) => {
	// 권한
	const { hasPermission, requestPermission } = useCameraPermission();
	useEffect(() => {
		(async () => {
			if (!hasPermission) {
				await requestPermission();
			}
		})();
	}, [hasPermission, requestPermission]);

	// 기기: 초광각 우선, 없으면 광각
	const device = useCameraDevice('back', {
		physicalDevices: ['ultra-wide-angle-camera', 'wide-angle-camera']
	});

	// 디지털 확대 0(중립줌)
	const neutralZoom = useMemo(() => {
		if (!device) return 1;
		if (typeof device.neutralZoom === 'number') return device.neutralZoom;
		if (typeof device.minZoom === 'number') return device.minZoom;
		return 1;
	}, [device]);

	const [zoom] = useState(neutralZoom);
	const cameraRef = useRef(null);
	const isFocused = useIsFocused();
	const canRun = isFocused && !!device && hasPermission;

	const onTakePhoto = async () => {
		try {
			const photo = await cameraRef.current?.takePhoto({
				qualityPrioritization: 'balanced',
				flash: 'off',
				enableShutterSound: Platform.OS === 'android'
			});
			// TODO: photo.path 사용
			// console.log(photo);
		} catch (e) {
			console.warn(e);
		}
	};

	if (!device) {
		return (
			<View style={styles.center}>
				<Text style={styles.txt}>카메라 준비 중…</Text>
			</View>
		);
	}
	if (!hasPermission) {
		return (
			<View style={styles.center}>
				<Text style={styles.txt}>카메라 권한이 필요합니다</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Camera
				ref={cameraRef}
				style={StyleSheet.absoluteFill}
				device={device}
				isActive={canRun}
				photo={true}
				// 화면 꽉 채움(일부 센서 크롭은 불가피) + 디지털 줌 0으로 "과확대" 방지
				resizeMode="cover"
				zoom={zoom}
				enableZoomGesture={false}
				videoStabilizationMode="off"
			/>

			{/* 우측 상단 X */}
			<TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
				<Text style={styles.closeTxt}>✕</Text>
			</TouchableOpacity>

			{/* 하단 중앙 셔터 */}
			<View style={styles.bottomBar}>
				<TouchableOpacity style={styles.shutter} onPress={onTakePhoto} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black'
	},
	center: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'black'
	},
	txt: {
		color: 'white',
		fontSize: 16
	},
	closeBtn: {
		position: 'absolute',
		top: 20,
		right: 16,
		width: 44,
		height: 44,
		borderRadius: 22,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,0.35)'
	},
	closeTxt: {
		color: 'white',
		fontSize: 18,
		fontWeight: '600'
	},
	bottomBar: {
		position: 'absolute',
		bottom: 28,
		left: 0,
		right: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},
	shutter: {
		width: 70,
		height: 70,
		borderRadius: 35,
		borderWidth: 6,
		borderColor: 'white',
		backgroundColor: 'rgba(255,255,255,0.15)'
	}
});

export default CameraScreen;
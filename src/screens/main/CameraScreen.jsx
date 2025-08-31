import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import CornerFrameOverlay from '../../components/CornerFrameOverlay';

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
				enableShutterSound: Platform.OS === 'android',
				// saveToPhotos: false, // 갤러리에 저장 원하면 true로
			});

			// VisionCamera는 Android에서 path가 "file://" 프리픽스가 없을 수 있으므로 정규화
			const uri = Platform.OS === 'android' && !photo.path.startsWith('file://')
				? `file://${photo.path}`
				: photo.path;

			// 필요한 값 함께 전달 (width/height 등)
			navigation.navigate('FoodInfoScreen', {
				photoUri: uri,
				width: photo.width,
				height: photo.height,
				// timestamp: photo.metadata?.Exif?.DateTimeOriginal ?? Date.now(),
			});
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
				resizeMode="cover"
				zoom={zoom}
				enableZoomGesture={false}
				videoStabilizationMode="off"
			/>

			{/* 중앙 선 SVG */}
			<CornerFrameOverlay />

			{/* X 버튼 */}
			<TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
				<Text style={styles.closeTxt}>✕</Text>
			</TouchableOpacity>

			{/* 셔터 버튼 */}
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
		backgroundColor: 'rgba(0,0,0,0.25)'
	},
	closeTxt: {
		color: 'white',
		fontSize: 20,
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
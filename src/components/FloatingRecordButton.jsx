// components/FloatingRecordButton.jsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FloatingRecordButton = ({ label = '기록', onPress }) => {
	const insets = useSafeAreaInsets();

	return (
		<View pointerEvents="box-none" style={styles.overlay}>
			<TouchableOpacity
				activeOpacity={0.9}
				onPress={onPress}
				style={[
					styles.button,
					{
						bottom: insets.bottom + 24,		// 탭바/홈인디케이터와 간섭 방지
						right: 20,
					},
				]}
				hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
				accessibilityRole="button"
				accessibilityLabel={label}
			>
				<Text style={styles.text}>{label}</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	overlay: {
		...StyleSheet.absoluteFillObject,
		zIndex: 20,								// 마스코트/클라우드보다 위
	},
	button: {
		position: 'absolute',
		height: 64,
		minWidth: 64,
		paddingHorizontal: 20,
		borderRadius: 32,
		backgroundColor: '#FFFFFF',
		justifyContent: 'center',
		alignItems: 'center',

		// iOS 그림자
		// shadowColor: '#666',
		// shadowOpacity: 0.02,
		// shadowRadius: 1,
		// shadowOffset: { width: 0, height: 3 },
		// // Android 그림자
		// elevation: 5,
	},
	text: {
		fontSize: 20,
		fontFamily: 'ONE Mobile POP OTF',
		color: '#7B7BEA',						// 디자인에 맞게 조정
	},
});

export default FloatingRecordButton;
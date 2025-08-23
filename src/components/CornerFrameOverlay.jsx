// from CameraScreen.jsx
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const CornerFrameOverlay = ({
	frameWidth = Math.min(SCREEN_W * 0.6, 320),
	frameHeight = Math.min(SCREEN_W * 0.6, 320),
	radius = 30,
	length = 35,
	strokeWidth = 4,
	color = '#FFFFFF',
	opacity = 0.90,
}) => {
	const x = (SCREEN_W - frameWidth) / 2;
	const y = (SCREEN_H - frameHeight) / 2;

	// 안전 클램프
	const r = Math.max(2, Math.min(radius, frameWidth / 2, frameHeight / 2));
	const L = Math.max(6, Math.min(length, Math.min(frameWidth, frameHeight) / 2 - r));

	// A rx ry xAxisRot largeArcFlag sweepFlag x y
	// TL: Top Left
	// TR: Top Right
	// BL: Bottom Left
	// BR: Bottom Right
	const TL = `M${x + r + L} ${y} H${x + r} A${r} ${r} 0 0 0 ${x} ${y + r} V${y + r + L}`;
	const TR = `M${x + frameWidth - r - L} ${y} H${x + frameWidth - r} A${r} ${r} 0 0 1 ${x + frameWidth} ${y + r} V${y + r + L}`;
	const BL = `M${x} ${y + frameHeight - r - L} V${y + frameHeight - r} A${r} ${r} 0 0 0 ${x + r} ${y + frameHeight} H${x + r + L}`;
	const BR = `M${x + frameWidth} ${y + frameHeight - r - L} V${y + frameHeight - r} A${r} ${r} 0 0 1 ${x + frameWidth - r} ${y + frameHeight} H${x + frameWidth - r - L}`;


	return (
		<View pointerEvents="none" style={styles.overlay}>
			<Svg width={SCREEN_W} height={SCREEN_H}>
				<Path d={TL} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" opacity={opacity} />
				<Path d={TR} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" opacity={opacity} />
				<Path d={BL} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" opacity={opacity} />
				<Path d={BR} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" opacity={opacity} />
			</Svg>
		</View>
	);
};

const styles = StyleSheet.create({
	overlay: {
		position: 'absolute',
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
	},
});

export default CornerFrameOverlay;

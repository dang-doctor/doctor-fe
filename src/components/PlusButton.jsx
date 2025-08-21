import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

const PlusButton = ({ size = 56, color = '#ffffff', bg = '#0EA5E9', strokeWidth = 2, onPress }) => {
	// 선이 또렷하게 보이도록 half-pixel 보정
	const half = size / 2;
	const offset = (strokeWidth % 2 === 0) ? 0 : 0.5;

	return (
		<Pressable
			onPress={onPress}
			style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }]}
			hitSlop={12}
			accessibilityRole="button"
			accessibilityLabel="add"
		>
			<Svg width={size} height={size}>
				<Line
					x1={8}
					y1={half + offset}
					x2={size - 8}
					y2={half + offset}
					stroke={color}
					strokeWidth={strokeWidth}
					strokeLinecap="round"
				/>
				<Line
					x1={half + offset}
					y1={8}
					x2={half + offset}
					y2={size - 8}
					stroke={color}
					strokeWidth={strokeWidth}
					strokeLinecap="round"
				/>
			</Svg>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	wrap: {
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default PlusButton;

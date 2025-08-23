// components/MemoBox.jsx
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const MAIN_FONT = 'ONE Mobile POP OTF';

const MemoBox = ({ value, onChangeText, height = 120 }) => {
	return (
		<View style={styles.container}>
			<TextInput
				style={[styles.input, { height }]}
				value={value}
				onChangeText={onChangeText}
				placeholder="메모"
				placeholderTextColor="#999"
				multiline={true}
				textAlignVertical="top"
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		backgroundColor: '#E6F0FF',
		borderRadius: 16,
		paddingVertical: 10,
	},
	input: {
		width: '100%',
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 12,
		fontSize: 14,
		color: '#111',
		fontFamily: MAIN_FONT,
	},
});

export default MemoBox;
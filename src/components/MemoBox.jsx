// components/MemoBox.jsx
import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';

const MAIN_FONT = 'ONE Mobile POP OTF';

const MemoBox = ({ value, onChangeText, height = 120, onPressSave }) => {
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
			<View style={styles.buttonWrapper}>
				<TouchableOpacity
					style={styles.saveButton}
					onPress={onPressSave}
				>
					<Text style={styles.saveButtonText}>저장</Text>
				</TouchableOpacity>
			</View>
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
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		padding: 12,
		fontSize: 14,
		color: '#111',
		fontFamily: MAIN_FONT,
	},
	buttonWrapper: {
		width: '100%',
		height: 60,
		borderBottomRightRadius: 16,
		borderBottomLeftRadius: 16,
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'flex-end',
		padding: 10,
	},
	saveButton: {
		width: 50,
		height: 40,
		backgroundColor: '#929EFF',
		justifyContent: 'center',
		borderRadius: 10,
	},
	saveButtonText: {
		textAlign: 'center',
		color: '#fff',
		fontFamily: MAIN_FONT,
	},
});

export default MemoBox;
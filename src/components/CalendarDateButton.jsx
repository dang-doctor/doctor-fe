// components/CalendarDateButton.jsx
import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MAIN_FONT = 'ONE Mobile POP OTF';

const CalendarDateButton = ({ initialDate = new Date(), onChange, maximumDate = new Date() }) => {
	let [date, setDate] = useState(initialDate);
	let [open, setOpen] = useState(false);

	const handleConfirm = (d) => {
		setDate(d);
		setOpen(false);
		onChange && onChange(d);
	};

	const formatDate = (d) => {
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0'); // 01~12
		const day = String(d.getDate()).padStart(2, '0'); // 01~31
		return `${year}.${month}.${day}`;
	};

	return (
		<View>
			<TouchableOpacity
				style={styles.iconButton}
				onPress={() => setOpen(true)}
				activeOpacity={0.7}
				accessibilityRole="button"
				accessibilityLabel="날짜 선택"
				hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
			>

				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					<Ionicons name="calendar-clear" size={22} color="#fff" />
					<Text style={styles.dateText}>
						{formatDate(date)}
					</Text>
				</View>
				<Text style={styles.dateText}>▼</Text>
			</TouchableOpacity>

			<DatePicker
				modal
				open={open}
				date={date}
				mode="date"
				locale="ko"
				androidVariant="iosClone"
				maximumDate={maximumDate}   // 오늘 이후 선택 불가로 막고 싶으면 기본값 그대로 사용
				// minimumDate={minimumDate}   // 필요 시 과거 하한선 지정
				title="날짜 선택"
				confirmText="확인"
				cancelText="취소"
				onConfirm={handleConfirm}
				onCancel={() => setOpen(false)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	iconButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 10,
		backgroundColor: '#929EFF',
		justifyContent: 'space-between',
		marginBottom: 5,
	},
	dateText: {
		marginLeft: 8,
		fontSize: 16,
		color: '#fff',
		fontFamily: MAIN_FONT,
	},
});

export default CalendarDateButton;

// src/components/DateHeader.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const K_WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const startOfDay = (d) => {
	const nd = new Date(d);
	nd.setHours(0, 0, 0, 0);
	return nd;
};
const addDays = (d, n) => {
	const nd = new Date(d);
	nd.setDate(nd.getDate() + n);
	return nd;
};
const isSameDay = (a, b) => startOfDay(a).getTime() === startOfDay(b).getTime();
const isAfter = (a, b) => startOfDay(a).getTime() > startOfDay(b).getTime();

const fmtDate = (d) => {
	const m = d.getMonth() + 1;
	const day = d.getDate();
	return `${m}/${day} `;
};

const fmtWeekday = (d) => {
	return K_WEEKDAYS[d.getDay()];
};

const DateHeader = ({ initialDate, onDateChange }) => {
	const today = useMemo(() => startOfDay(new Date()), []);
	const [selected, setSelected] = useState(startOfDay(initialDate || new Date()));

	useEffect(() => {
		if (typeof onDateChange === 'function') {
			onDateChange(selected);
		}
	}, []);

	const prevDate = useMemo(() => addDays(selected, -1), [selected]);
	const nextDate = useMemo(() => addDays(selected, 1), [selected]);

	const showNext = !isAfter(nextDate, today);

	const handlePick = (d) => {
		if (isAfter(d, today)) return;
		setSelected(startOfDay(d));
		if (typeof onDateChange === 'function') {
			onDateChange(startOfDay(d));
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.row}>
				{(
					<TouchableOpacity
						onPress={() => handlePick(prevDate)}
						hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
						style={styles.sideBtn}
					>
						<Text style={styles.sideText}>
							{fmtDate(prevDate)}
						</Text>
						<Text style={styles.sideText}>
							{fmtWeekday(prevDate)}
						</Text>
					</TouchableOpacity>
				)}

				<View style={styles.centerWrap}>
					<Text style={styles.centerDate}>
						{fmtDate(selected)}
					</Text>
					<Text style={styles.centerWeekday}>
						{fmtWeekday(selected)}
					</Text>
				</View>

				{showNext ? (
					<TouchableOpacity
						onPress={() => handlePick(nextDate)}
						hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
						style={styles.sideBtn}
					>
						<Text style={styles.sideText}>
						{fmtDate(nextDate)}
					</Text>
					<Text style={styles.sideText}>
						{fmtWeekday(nextDate)}
					</Text>
					</TouchableOpacity>
				) : (
					<View style={styles.sideBtn} />
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		width: '100%',
		justifyContent: 'center',
		paddingHorizontal: 16,
		height: 60,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	sideBtn: {
		minWidth: 88,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 6,
		flexDirection: 'row',
	},
	sideText: {
		fontSize: 14,
		color: '#C0C4CC',
		fontFamily: 'ONE Mobile POP OTF',
	},
	centerWrap: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		height: 50,
	},
	centerDate: {
		fontSize: 18,
		color: '#111111',
		fontFamily: 'ONE Mobile POP OTF',
	},
	centerWeekday: {
		fontFamily: 'ONE Mobile POP OTF',
		fontSize: 16,
		color: "#fff",
		backgroundColor: '#111111',
		padding: 4,
		aspectRatio: 1,
		textAlign: 'center',
		borderRadius: 50,
		width: 24,
	}
});

export default DateHeader;

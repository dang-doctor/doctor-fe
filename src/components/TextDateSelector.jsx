import React, { useState } from 'react';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DatePicker from 'react-native-date-picker';

const formatDate = (date) => {
	const y = date.getFullYear();
	const m = String(date.getMonth()+1).padStart(2,'0');
	const d = String(date.getDate()).padStart(2,'0');
	return `${y}/${m}/${d}`;
};

const getTodayAtLocalMidnight = () => {
	const t = new Date();
	t.setHours(0, 0, 0, 0);
	return t;
}

const TextDateSelector = ({ initialDate, onChange }) => {
	const today = useMemo(() => getTodayAtLocalMidnight(), []);
	const [open, setOpen] = useState(false);
	const [date, setDate] = useState(() =>{
		const start = initialDate ? new Date(initialDate) : new Date();
		start.setHours(0,0,0,0);
		return start>today ? today : start;
	});

	const handleConfirm = (picked) => {
		picked.setHours(0,0,0,0);
		setOpen(false);
		const capped = picked>today ? today : picked;
		setDate(capped);
		onChange && onChange(capped);
	};

	return (
		<View>
			<Pressable
				onPress={() => setOpen(true)}
				// 텍스트 바깥으로 터치 판정 확장
				hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
				// 실제 시각적 터치 영역도 넓힘
				style={({ pressed }) => [
					styles.touchArea,
					pressed && { opacity: 0.6 },
				]}
				accessible
				accessibilityRole="button"
				accessibilityLabel="날짜 선택"
				android_ripple={{ borderless: false }}
			>
				<Text style={styles.dateText}>
					{`${formatDate(date)}`}
				</Text>
			</Pressable>
			<DatePicker
				modal
				open={open}
				date={date}
				mode="date"
				maximumDate={today}
				onConfirm={handleConfirm}
				onConcel={()=>setOpen(false)}
				theme="auto"
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	touchArea: {
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	dateText: {
		fontSize: 16,
		fontFamily: "ONE Mobile POP OTF",
		fontWeight: '600',
		textAlign: "center",
	}
})

export default TextDateSelector;
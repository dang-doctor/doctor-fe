// screens/blood/BloodSugarAddScreen.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TimeSelectorRow from '../../components/TimeSelectorRow';
import CalendarDateButton from '../../components/CalendarDateButton';
import BloodEntryCard from '../../components/BloodEntryCard';
import MemoBox from '../../components/MemoBox';

const MAIN_FONT = 'ONE Mobile POP OTF';

const BloodSugarAddScreen = ({ route, navigation }) => {
	// params: { time: 'wakeup' | 'morning' | 'noon' | 'evening', selectedDate?: Date|string|number }
	const initialTime = route?.params?.time ?? 'wakeup';
	const initialDate = route?.params?.selectedDate ? new Date(route.params.selectedDate) : new Date();

	const [time, setTime] = useState(() => initialTime);
	const [selectedDate, setSelectedDate] = useState(() => initialDate);
	const [memo, setMemo] = useState('');

	// 카드별 상태
	const [entries, setEntries] = useState({
		before: { glucose: null, time: new Date() },
		after1: { glucose: null, time: new Date() },
		after2: { glucose: null, time: new Date() },
	});

	const handleSaveMemo = async () => {
		// TODO : memp값 저장 통신 함수
	};

	// 'wakeup' 전환 시 식후 값 초기화(원치 않으면 제거 가능)
	useEffect(() => {
		if (time === 'wakeup') {
			setEntries((prev) => ({
				...prev,
				after1: { glucose: null, time: new Date() },
				after2: { glucose: null, time: new Date() },
			}));
		}
	}, [time]);

	const update = (key) => (payload) => {
		setEntries((prev) => ({
			...prev,
			[key]: {
				glucose: payload.glucose,
				time: payload.time,
			},
		}));
		// TODO: 서버 저장/검증 등 추가 로직
	};

	return (
		<View style={styles.container}>
			<Text style={styles.headerText}>혈당 추가</Text>

			<View style={{ width: '100%'}}>
				<TimeSelectorRow
					initialKey={initialTime}
					onPick={(key) => setTime(key)}
				/>
			</View>

			<ScrollView
				style={styles.contentWrapper}
				contentContainerStyle={[
					styles.scrollContent,                 
					{ paddingBottom: 40 },
				]}
			>
				<CalendarDateButton
					initialDate={selectedDate}
					maximumDate={new Date()}
					onChange={(picked) => {
						setSelectedDate(picked);
					}}
				/>

				{/* 공통: 식전 */}
				<BloodEntryCard
					label="식전"
					initialGlucose={entries.before.glucose}
					initialTime={entries.before.time}
					onChange={update('before')}
				/>

				{/* wakeup 이외에만 식후 1/2 표시 */}
				{time !== 'wakeup' && (
					<>
						<BloodEntryCard
							label="식후 1"
							initialGlucose={entries.after1.glucose}
							initialTime={entries.after1.time}
							onChange={update('after1')}
						/>
						<BloodEntryCard
							label="식후 2"
							initialGlucose={entries.after2.glucose}
							initialTime={entries.after2.time}
							onChange={update('after2')}
						/>
					</>
				)}
				<MemoBox value={memo} onChangeText={setMemo} onPressSave={handleSaveMemo} />
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	headerText: {
		fontFamily: MAIN_FONT,
		fontSize: 20,
		color: '#111',
		backgroundColor: '#fff',
		width: '100%',
		height: 60,
		textAlignVertical: 'center',
		paddingLeft: 20,
	},
	contentWrapper: {
		backgroundColor: '#E6F0FF',
		marginHorizontal: 20,
		borderRadius: 20,
		padding: 20,
	},
});

export default BloodSugarAddScreen;
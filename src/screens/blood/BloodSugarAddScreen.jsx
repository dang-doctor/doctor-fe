import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TimeSelectorRow from '../../components/TimeSelectorRow'; // 기존/새 컴포넌트 경로에 맞춰 수정

const MAIN_FONT = 'ONE Mobile POP OTF';

const BloodSugarAddScreen = ({ route, navigation }) => {
	// params.time을 1회 초기값으로만 사용 (이후엔 이 화면에서 독립 관리)
	const initialTime = route?.params?.time ?? 'wakeup';
	const [time, setTime] = useState(() => initialTime);

	return (
		<View style={styles.container}>
			<Text style={styles.headerText}>혈당 추가</Text>

			{/* 가로 스크롤 선택 바: 클릭 시 중앙 정렬 + onPick으로 현재 화면의 state 업데이트 */}
			<View style={{ width: '100%', marginTop: 12 }}>
				<TimeSelectorRow
					initialKey={initialTime}
					onPick={(key) => setTime(key)}
				/>
			</View>

			{/* 아래에 time에 따른 입력/표시 UI 배치 */}
			<View style={{ marginTop: 20 }}>
				<Text>현재 선택: {time}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8fafc',
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
});

export default BloodSugarAddScreen;

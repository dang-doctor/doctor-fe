// src/screens/chart/MyPageScreen.jsx
import React, { useState, useMemo } from 'react';
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import Colors from '../../constants/colors';

// ✅ 세션 연결 (경로는 프로젝트 맞게 조정)
import { useSession } from '../../session/SessionProvider';

const BGCOLOR = Colors?.key?.background ?? '#F7F9FD';
const MAIN_FONT = 'ONE Mobile POP OTF';

const MyPageScreen = () => {
	const { saveUserPrefs } = useSession?.() || { saveUserPrefs: () => {} };

	const [gender, setGender] = useState(null);
	const [height, setHeight] = useState('');
	const [weight, setWeight] = useState('');
	const [activity, setActivity] = useState(null);

	const [carb, setCarb] = useState(55);
	const [protein, setProtein] = useState(15);
	const [fat, setFat] = useState(20);

	const total = useMemo(
		() => (carb || 0) + (protein || 0) + (fat || 0),
		[carb, protein, fat]
	);

	const onSave = () => {
		if (!gender) return Alert.alert('확인', '성별을 선택해 주세요.');
		if (!height) return Alert.alert('확인', '키를 입력해 주세요.');
		if (!weight) return Alert.alert('확인', '몸무게를 입력해 주세요.');
		if (!activity) return Alert.alert('확인', '활동 수준을 선택해 주세요.');
		if (total !== 100)
			return Alert.alert('확인', `탄/단/지 합이 100%가 아닙니다. (현재 ${total}%)`);

		const prefs = {
			gender,
			height: Number(height),
			weight: Number(weight),
			activity,
			macros: { carb, protein, fat },
			updatedAt: Date.now(),
		};

		saveUserPrefs(prefs);
		Alert.alert('저장 완료', '입력값이 세션에 저장되었습니다.');
	};

	return (
		<View style={{ flex: 1, backgroundColor: BGCOLOR }}>
			<Text style={styles.headerText}>
				나에게 맞춘 건강 정보를 설정해보세요!
			</Text>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={{
					paddingHorizontal: 20,
					paddingTop: 30,
					paddingBottom: 90,
					alignItems: 'center',
				}}
			>
				<View style={styles.container}>
					{/* 성별 */}
					<Text style={styles.label}>성별</Text>
					<View style={styles.row}>
						<TouchableOpacity
							style={[styles.genderBtn, gender === '남' && styles.selectedMale]}
							onPress={() => setGender('남')}
						>
							<Text style={styles.genderText}>남</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.genderBtn, gender === '여' && styles.selectedFemale]}
							onPress={() => setGender('여')}
						>
							<Text style={styles.genderText}>여</Text>
						</TouchableOpacity>
					</View>

					{/* 키 */}
					<Text style={styles.label}>키</Text>
					<View style={styles.inputRow}>
						<TextInput
							style={styles.input}
							value={height}
							onChangeText={setHeight}
							placeholder="예) 162"
							keyboardType="numeric"
						/>
						<Text style={styles.unit}>cm</Text>
					</View>

					{/* 몸무게 */}
					<Text style={styles.label}>몸무게</Text>
					<View style={styles.inputRow}>
						<TextInput
							style={styles.input}
							value={weight}
							onChangeText={setWeight}
							placeholder="예) 52"
							keyboardType="numeric"
						/>
						<Text style={styles.unit}>kg</Text>
					</View>

					{/* 활동 수준 */}
					<Text style={styles.label}>활동 수준</Text>
					<View style={styles.box}>
						{['가벼운 활동', '보통 활동', '힘든 활동'].map((level) => (
							<TouchableOpacity
								key={level}
								style={styles.radioRow}
								onPress={() => setActivity(level)}
							>
								<View
									style={[
										styles.radioCircle,
										activity === level && styles.radioSelected,
									]}
								/>
								<View>
									<Text style={styles.radioLabel}>{level}</Text>
									<Text style={styles.radioSub}>
										{level === '가벼운 활동' &&
											'평소에 앉아서 생활할 때'}
										{level === '보통 활동' &&
											'걷거나 가벼운 활동이 많을 때'}
										{level === '힘든 활동' &&
											'평소 운동량(움직임)이 많을 때'}
									</Text>
								</View>
							</TouchableOpacity>
						))}
					</View>

					{/* 탄단지 */}
					{/* <Text style={styles.label}>탄단지 비율 설정 (총합 100%)</Text>
					<View style={styles.box}>
						<View style={styles.sliderRow}>
							<Text style={styles.sliderLabel}>탄수화물 {carb}%</Text>
							<Slider
								style={{ flex: 1 }}
								value={carb}
								minimumValue={0}
								maximumValue={100}
								step={1}
								onValueChange={setCarb}
							/>
						</View>
						<View style={styles.sliderRow}>
							<Text style={styles.sliderLabel}>단백질 {protein}%</Text>
							<Slider
								style={{ flex: 1 }}
								value={protein}
								minimumValue={0}
								maximumValue={100}
								step={1}
								onValueChange={setProtein}
							/>
						</View>
						<View style={styles.sliderRow}>
							<Text style={styles.sliderLabel}>지방 {fat}%</Text>
							<Slider
								style={{ flex: 1 }}
								value={fat}
								minimumValue={0}
								maximumValue={100}
								step={1}
								onValueChange={setFat}
							/>
						</View>
						<Text style={styles.totalTip}>합계: {total}%</Text>
					</View> */}

					{/* 저장 버튼 */}
					<TouchableOpacity style={styles.saveBtn} onPress={onSave}>
						<Text style={styles.saveText}>저장</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	headerText: {
		fontFamily: MAIN_FONT,
		fontSize: 16,
		paddingTop: 16,
		paddingHorizontal: 20,
	},
	scrollView: { flex: 1, width: '100%' },
	container: { width: '100%', backgroundColor: '#fff', padding: 16, borderRadius: 16 },
	label: { fontFamily: MAIN_FONT, fontSize: 16, marginTop: 15, marginBottom: 8 },
	row: { flexDirection: 'row', gap: 10 },
	genderBtn: {
		flex: 1,
		padding: 12,
		borderRadius: 10,
		alignItems: 'center',
		backgroundColor: '#EDEDED',
	},
	selectedMale: { backgroundColor: '#AECFFF' },
	selectedFemale: { backgroundColor: '#FFB6C1' },
	genderText: { fontFamily: MAIN_FONT, fontSize: 16 },
	inputRow: { flexDirection: 'row', alignItems: 'center' },
	input: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		padding: 10,
		fontSize: 15,
		backgroundColor: 'white',
	},
	unit: { marginLeft: 10, fontSize: 15 },
	box: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 15,
		marginTop: 5,
		width: '100%',
	},
	radioRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
	radioCircle: {
		width: 18,
		height: 18,
		borderRadius: 9,
		borderWidth: 2,
		borderColor: '#aaa',
		marginRight: 10,
	},
	radioSelected: { backgroundColor: '#FF8FA3' },
	radioLabel: { fontSize: 15, fontWeight: 'bold' },
	radioSub: { fontSize: 12, color: '#666' },
	sliderRow: { marginVertical: 10 },
	sliderLabel: { marginBottom: 4, fontSize: 14 },
	totalTip: { marginTop: 6, alignSelf: 'flex-end', color: '#888' },
	saveBtn: {
		marginTop: 18,
		backgroundColor: '#6C7EE1',
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: 'center',
	},
	saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default MyPageScreen;
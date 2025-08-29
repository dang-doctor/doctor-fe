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

	// 🔹 탄단지 UI는 제거했지만, 기존 상태값/로직은 유지 (네가 수정해둔 것 살림)
	const [carb, setCarb] = useState(55);
	const [protein, setProtein] = useState(15);
	const [fat, setFat] = useState(20);

	const total = useMemo(
		() => (carb || 0) + (protein || 0) + (fat || 0),
		[carb, protein, fat]
	);

	// 🔹 결과 상태 추가
	const [result, setResult] = useState(null);	// { stdWeight, minKcal, maxKcal, midKcal }

	// 🔹 활동계수 범위 매핑 (가벼운 25~30 / 보통 30~35 / 힘든 35~40)
	const getActivityRange = (label) => {
		if (!label) return null;
		if (label === '가벼운 활동') return [25, 30];
		if (label === '보통 활동') return [30, 35];
		if (label === '힘든 활동') return [35, 40];
		return null;
	};

	// 🔹 표준체중 계산: 남(22), 여(21)
	const calcStdWeight = (g, hMeter) => {
		if (!g || !hMeter) return null;
		const factor = g === '남' ? 22 : 21;
		return Math.pow(hMeter, 2) * factor;
	};

	const onSave = () => {
		if (!gender) return Alert.alert('확인', '성별을 선택해 주세요.');
		if (!height) return Alert.alert('확인', '키를 입력해 주세요.');
		if (!weight) return Alert.alert('확인', '몸무게를 입력해 주세요.');
		if (!activity) return Alert.alert('확인', '활동 수준을 선택해 주세요.');
		// if (total !== 100)
		// 	return Alert.alert('확인', `탄/단/지 합이 100%가 아닙니다. (현재 ${total}%)`);

		const hMeter = Number(height) / 100;
		if (!hMeter || Number.isNaN(hMeter)) {
			return Alert.alert('확인', '키는 숫자로 입력해 주세요.');
		}

		// 🔹 계산
		const stdWeight = calcStdWeight(gender, hMeter);
		const range = getActivityRange(activity);
		if (!stdWeight || !range) {
			return Alert.alert('확인', '계산을 위한 값이 올바르지 않습니다.');
		}

		const minKcal = Math.round(stdWeight * range[0]);
		const maxKcal = Math.round(stdWeight * range[1]);
		const midKcal = Math.round((minKcal + maxKcal) / 2);

		setResult({
			stdWeight: Math.round(stdWeight * 10) / 10, // 소수 1자리 반올림
			minKcal,
			maxKcal,
			midKcal,
		});

		// 🔹 세션 저장 (네가 유지한 prefs 구조 그대로)
		const prefs = {
			gender,
			height: Number(height),
			weight: Number(weight),
			activity,
			macros: { carb, protein, fat },
			updatedAt: Date.now(),
		};

		saveUserPrefs(prefs);
		Alert.alert('저장 완료', '입력값이 세션에 저장되고, 결과가 계산되었습니다.');
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
											'평소에 앉아서 생활할 때 (25~30)'}
										{level === '보통 활동' &&
											'걷거나 가벼운 활동이 많을 때 (30~35)'}
										{level === '힘든 활동' &&
											'운동량(움직임)이 많은 편 (35~40)'}
									</Text>
								</View>
							</TouchableOpacity>
						))}
					</View>

					{/* 저장 + 계산 버튼 */}
					<TouchableOpacity style={styles.saveBtn} onPress={onSave}>
						<Text style={styles.saveText}>저장 및 계산하기</Text>
					</TouchableOpacity>

					{/* 결과 렌더링 */}
					{result && (
						<View style={[styles.box, { marginTop: 12 }]}>
							<Text style={styles.resultTitle}>계산 결과</Text>
							<Text style={styles.resultLine}>
								표준체중: <Text style={styles.resultStrong}>{result.stdWeight} kg</Text>
							</Text>
							<Text style={styles.resultLine}>
								하루 섭취열량(범위):{' '}
								<Text style={styles.resultStrong}>
									{result.minKcal} ~ {result.maxKcal} kcal
								</Text>
							</Text>
							<Text style={styles.resultLine}>
								권장 기준(중간값):{' '}
								<Text style={styles.resultStrong}>{result.midKcal} kcal</Text>
							</Text>
							<Text style={styles.resultHint}>
								※ 예) 165cm, 여: 1.65² × 21 × (활동계수) → 25~30 / 30~35 / 35~40
							</Text>
						</View>
					)}
				</View>

			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	headerText: {
		fontFamily: MAIN_FONT,
		fontSize: 16,
		paddingVertical: 16,
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
	resultTitle: { fontFamily: MAIN_FONT, fontSize: 16, marginBottom: 8 },
	resultLine: { fontSize: 14, marginVertical: 2 },
	resultStrong: { fontWeight: 'bold' },
	resultHint: { marginTop: 6, fontSize: 12, color: '#777' },
});

export default MyPageScreen;
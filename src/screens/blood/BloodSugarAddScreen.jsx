// screens/blood/BloodSugarAddScreen.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import { useSession } from '../../session/SessionProvider';
import TimeSelectorRow from '../../components/TimeSelectorRow';
import CalendarDateButton from '../../components/CalendarDateButton';
import BloodEntryCard from '../../components/BloodEntryCard';
import { apiFetch } from '../../session/apiFetch';
import { auth } from '../../session/firebaseConfig';

const MAIN_FONT = 'ONE Mobile POP OTF';
const BASE_URL = Config.API_BASE_URL;

const pad2 = (n) => String(n).padStart(2, '0');
const formatDate = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const formatTime = (d) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

const DEFAULT_BUCKET = () => ({ before: { glucose: null, time: new Date() }, after1: { glucose: null, time: new Date() }, after2: { glucose: null, time: new Date() } });

const BloodSugarAddScreen = ({ route, navigation }) => {
	// params: { time: 'wakeup' | 'morning' | 'noon' | 'evening', selectedDate?: Date|string|number, blood_sugar_id?: string }
	const initialTime = route?.params?.time ?? 'wakeup';
	const initialId = route?.params?.blood_sugar_id || route?.params?.bloodSugarId || null;
	const initialDate = route?.params?.selectedDate ? new Date(route.params.selectedDate) : new Date();

	const [time, setTime] = useState(() => initialTime);
	const [selectedDate, setSelectedDate] = useState(() => initialDate);
	const { token, user, idToken } = useSession();

	// 시간대별 독립 값/ID 관리
	const [dayEntries, setDayEntries] = useState({
		wakeup: DEFAULT_BUCKET(),
		morning: DEFAULT_BUCKET(),
		noon: DEFAULT_BUCKET(),
		evening: DEFAULT_BUCKET(),
	});
	const [recordIds, setRecordIds] = useState({ wakeup: null, morning: null, noon: null, evening: null });

	const mealTypeToKey = useMemo(() => ({ '기상직후': 'wakeup', '아침': 'morning', '점심': 'noon', '저녁': 'evening' }), []);
	const mealTypeMap = useMemo(() => ({ wakeup: '기상직후', morning: '아침', noon: '점심', evening: '저녁' }), []);

	const getAuthToken = useCallback(async () => {
		// SessionProvider에서 idToken을 사용
		if (idToken) {
			console.log('[DEBUG] Using idToken from session:', idToken.substring(0, 10) + '...');
			return idToken;
		}

		// 1) Firebase 현재 세션에서 ID 토큰 시도
		try {
			const current = auth.currentUser;
			if (current) {
				const fresh = await current.getIdToken(true);
				if (fresh) {
					await AsyncStorage.setItem('accessToken', fresh);
					console.log('[DEBUG] Using firebase auth.currentUser token:', fresh.substring(0, 10) + '...');
					return fresh;
				}
			}
		} catch (e) {
			console.log('[DEBUG] firebase currentUser getIdToken failed:', e?.message);
		}

		// 2) 저장소/세션 토큰 확인
		let authToken = token || (await AsyncStorage.getItem('accessToken'));
		if (authToken) {
			console.log('[DEBUG] Using stored token:', authToken.substring(0, 10) + '...');
			return authToken;
		}

		// 3) kakao_id 기반 토큰 발급은 제거됨(테스트 코드)

		console.log('[DEBUG] No auth token available after all attempts');
		return null;
	}, [idToken, token, user, route?.params?.kakao_id]);

	const fetchBloodSugarById = useCallback(async (id) => {
		const authToken = await getAuthToken();
		const headers = { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) };
		console.log('[DEBUG] GET /blood-sugar/' + id, 'Headers:', JSON.stringify(headers, null, 2));
		
		const res = await fetch(`${BASE_URL}/blood-sugar/${id}`, { method: 'GET', headers });
		console.log('[DEBUG] Response status:', res.status, res.statusText);
		
		if (!res.ok) {
			const text = await res.text();
			console.log('[DEBUG] Error response:', text);
			throw new Error(`HTTP ${res.status}: ${text}`);
		}
		const json = await res.json();
		console.log('[DEBUG] Success response:', json);
		return json;
	}, [getAuthToken, idToken]);

	// 초기 진입 시 단일 id로 전달된 경우 해당 시간대로 세팅
	useEffect(() => {
		if (!initialId) return;
		(async () => {
			try {
				const d = await fetchBloodSugarById(initialId);
				// d: { id, blood_sugar, meal_type, date: 'YYYY-MM-DD', time: 'HH:mm' }
				const key = mealTypeToKey[d?.meal_type] ?? 'wakeup';
				const [yy, mm, dd] = String(d?.date || '').split('-').map((n) => Number(n));
				const [hh = 0, mi = 0] = String(d?.time || '').split(':').map((n) => Number(n));
				const dateObj = new Date(yy || new Date().getFullYear(), (mm || 1) - 1, dd || 1, hh, mi);

				setTime(key);
				setSelectedDate(dateObj);
				setDayEntries((prev) => ({
					...prev,
					[key]: { ...prev[key], before: { glucose: Number(d?.blood_sugar ?? 0), time: dateObj } },
				}));
				setRecordIds((prev) => ({ ...prev, [key]: String(d?.id) }));
			} catch (e) {
				Alert.alert('불러오기 실패', e?.message ?? '기록을 불러오지 못했습니다.');
			}
		})();
	}, [initialId, fetchBloodSugarById, mealTypeToKey]);

	// 'wakeup' 전환 시 해당 버킷만 노출
	const currentBucket = dayEntries[time];

	const update = (key) => (payload) => {
		setDayEntries((prev) => ({
			...prev,
			[time]: {
				...prev[time],
				[key]: { glucose: payload.glucose, time: payload.time },
			},
		}));
	};

	const postBloodSugar = async ({ blood_sugar, meal_type, date, time: t }) => {
		const authToken = await getAuthToken();
		const headers = { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) };
		const body = { blood_sugar, meal_type, date, time: t };
		
		console.log('[DEBUG] POST /blood-sugar/', 'Headers:', JSON.stringify(headers, null, 2), 'Body:', body);
		
		const res = await fetch(`${BASE_URL}/blood-sugar/`, { method: 'POST', headers, body: JSON.stringify(body) });
		console.log('[DEBUG] Response status:', res.status, res.statusText);
		
		if (!res.ok) {
			const text = await res.text();
			console.log('[DEBUG] Error response:', text);
			throw new Error(`HTTP ${res.status}: ${text}`);
		}
		const json = await res.json();
		console.log('[DEBUG] Success response:', json);
		return json;
	};

	const putBloodSugar = async (id, { blood_sugar, meal_type, date, time: t }) => {
		const authToken = await getAuthToken();
		const headers = { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) };
		const body = { id: String(id), blood_sugar, meal_type, date, time: t };
		
		console.log('[DEBUG] PUT /blood-sugar/' + id, 'Headers:', JSON.stringify(headers, null, 2), 'Body:', body);
		
		const res = await fetch(`${BASE_URL}/blood-sugar/${id}`, { method: 'PUT', headers, body: JSON.stringify(body) });
		console.log('[DEBUG] Response status:', res.status, res.statusText);
		
		if (!res.ok) {
			const text = await res.text();
			console.log('[DEBUG] Error response:', text);
			throw new Error(`HTTP ${res.status}: ${text}`);
		}
		const json = await res.json();
		console.log('[DEBUG] Success response:', json);
		return json;
	};

	const handleSubmitCurrent = async () => {
		try {
			const before = currentBucket.before;
			if (before.glucose == null) {
				Alert.alert('알림', '식전 혈당을 입력하세요.');
				return;
			}
			const dateStr = formatDate(selectedDate);
			const mealType = mealTypeMap[time] ?? '기타';
			const payload = { blood_sugar: Number(before.glucose), meal_type: mealType, date: dateStr, time: formatTime(before.time) };

			const existingId = recordIds[time];
			let result;
			if (existingId) {
				result = await putBloodSugar(existingId, payload);
			} else {
				result = await postBloodSugar(payload);
				if (result?.id) setRecordIds((prev) => ({ ...prev, [time]: String(result.id) }));
			}

			Alert.alert('완료', existingId ? '수정되었습니다.' : '등록되었습니다.');
		} catch (e) {
			Alert.alert('오류', e?.message ?? '요청에 실패했습니다.');
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.headerText}>혈당 추가</Text>

			{/* 테스트 버튼 제거 */}

			<View style={{ width: '100%'}}>
				<TimeSelectorRow initialKey={initialTime} onPick={(key) => setTime(key)} />
			</View>

			<ScrollView style={styles.contentWrapper} contentContainerStyle={[ styles.scrollContent, { paddingBottom: 40 } ]}>
				<CalendarDateButton
					initialDate={selectedDate}
					maximumDate={new Date()}
					onChange={(picked) => { setSelectedDate(picked); }}
				/>

				{/* 현재 시간대 버킷 값 표시 - key 로 강제 리마운트 */}
				<BloodEntryCard
					key={`${time}-before`}
					label="식전"
					initialGlucose={currentBucket.before.glucose}
					initialTime={currentBucket.before.time}
					onChange={update('before')}
				/>

				{time !== 'wakeup' && (
					<>
						<BloodEntryCard key={`${time}-after1`} label="식후 1" initialGlucose={currentBucket.after1.glucose} initialTime={currentBucket.after1.time} onChange={update('after1')} />
						<BloodEntryCard key={`${time}-after2`} label="식후 2" initialGlucose={currentBucket.after2.glucose} initialTime={currentBucket.after2.time} onChange={update('after2')} />
					</>
				)}

				<TouchableOpacity style={styles.submitBtn} onPress={handleSubmitCurrent} activeOpacity={0.9}>
					<Text style={styles.submitBtnText}>{recordIds[time] ? '수정' : '등록'}</Text>
				</TouchableOpacity>
				<View style={{height: 80}}></View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#fff' },
	headerText: { fontFamily: MAIN_FONT, fontSize: 20, color: '#111', backgroundColor: '#fff', width: '100%', height: 60, textAlignVertical: 'center', paddingLeft: 20 },
	contentWrapper: { backgroundColor: '#E6F0FF', marginHorizontal: 20, borderRadius: 20, padding: 20 },
	submitBtn: { backgroundColor: '#6d8cff', marginTop: 12, borderRadius: 14, alignItems: 'center', paddingVertical: 14 },
	submitBtnText: { color: '#fff', fontSize: 18, fontFamily: MAIN_FONT },
});

export default BloodSugarAddScreen;
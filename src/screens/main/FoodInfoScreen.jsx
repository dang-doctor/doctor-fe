// src/screens/food/FoodInfoScreen.jsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import Config from 'react-native-config'; // 없으면 npm install 필요
import { useSession } from '../../session/SessionProvider';
import Colors from '../../constants/colors';

const MAIN_FONT = 'ONE Mobile POP OTF';
const BGCOLOR = Colors.key.background;

const API_BASE_URL = Config.API_BASE_URL; // .env에 넣은 값 사용

const FoodInfoScreen = ({ route, navigation }) => {
	const { photoUri, width, height } = route?.params || {};
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [result, setResult] = useState(null);

	const { user, firebase_token } = useSession();

	// ✅ 더미 데이터 (화면 캡처처럼 표시)
	const [foodList, setFoodList] = useState([
		{ name: '토마토', amount: 20 },
		{ name: '샐러드', amount: 100 },
		{ name: '연어', amount: 340 },
		{ name: '레몬', amount: 30 },
	]);

	// 합계 예시(더미)
	const totalMacros = {
		carbs: 55,
		protein: 23,
		fat: 23,
		sugar: 55,
		kcal: 1500,
	};

	// 날짜/시간은 서버 스펙에 맞게 문자열(YYYY-MM-DD, HH:MM)로 준비
	const todayStr = useMemo(() => {
		const d = new Date();
		const mm = String(d.getMonth() + 1).padStart(2, '0');
		const dd = String(d.getDate()).padStart(2, '0');
		return `${d.getFullYear()}-${mm}-${dd}`;
	}, []);
	const timeStr = useMemo(() => {
		const d = new Date();
		const hh = String(d.getHours()).padStart(2, '0');
		const mm = String(d.getMinutes()).padStart(2, '0');
		return `${hh}:${mm}`;
	}, []);

	// 파일 이름/타입 추정
	const fileName = useMemo(() => {
		if (!photoUri) return 'meal.jpg';
		const parts = photoUri.split('/');
		return parts[parts.length - 1] || 'meal.jpg';
	}, [photoUri]);

	const mime = useMemo(() => {
		const lower = fileName.toLowerCase();
		if (lower.endsWith('.png')) return 'image/png';
		if (lower.endsWith('.webp')) return 'image/webp';
		return 'image/jpeg';
	}, [fileName]);

	// 업로드 함수
	const uploadMealImage = useCallback(async ({ fileUri, fileName, mime, date, time, notes }) => {
		const form = new FormData();
		form.append('image', { uri: fileUri, name: fileName, type: mime });
		form.append('date', date);
		form.append('time', time);
		if (notes != null) form.append('notes', notes);

		// 참고: RN에선 boundary 충돌 방지를 위해 Content-Type 생략하는게 안전함

		console.log("user.firebase_token : " + user?.firebase_token);
		console.log("user.user_id : " + user?.user_id);

		let getToken = "";
		await fetch(`${API_BASE_URL}/auth/firebase/refresh-token/${user?.user_id}`)
			.then((res) => res.json())
			.then((data) => {
				getToken = data?.firebase_token ?? '';
			})
			.catch((e) => console.warn(e));

		// 실제 업로드는 주석 처리(서버 연동 시 주석 해제)
		// const res = await fetch(`${API_BASE_URL}/meals/upload`, {
		// 	method: 'POST',
		// 	headers: { 'Authorization': `Bearer ${getToken}` },
		// 	body: form,
		// });
		// if (!res.ok) {
		// 	const text = await res.text().catch(() => '');
		// 	throw new Error(`HTTP ${res.status} ${text}`);
		// }
		// return res.json();
		return null; // 데모용
	}, [API_BASE_URL, user]);

	const onUpload = useCallback(async () => {
		if (!photoUri) {
			Alert.alert('오류', '사진 정보가 없습니다.');
			navigation.goBack();
			return;
		}
		try {
			setLoading(true);
			setError(null);
			const data = await uploadMealImage({
				fileUri: photoUri,
				fileName,
				mime,
				date: todayStr,
				time: timeStr,
				notes: null,
			});
			setResult(data);
		} catch (e) {
			console.error(e);
			setError(e.message);
			Alert.alert('업로드 실패', e.message);
		} finally {
			setLoading(false);
		}
	}, [photoUri, fileName, mime, todayStr, timeStr, uploadMealImage, navigation]);

	useEffect(() => {
		onUpload(); // 화면 진입 시 자동 업로드(데모에선 네트워크 호출만)
	}, [onUpload]);

	// 행의 + 버튼 예시 동작(필요 시 수정)
	const onPressAdd = useCallback((idx) => {
		Alert.alert('추가', `${foodList[idx].name} 추가`);
	}, [foodList]);

	const onPressRecord = useCallback(() => {
		Alert.alert('기록', '현재 항목과 합계를 기록합니다.(데모)');
	}, []);

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View style={styles.imageCard}>
				<Image source={{ uri: photoUri }} style={styles.image} resizeMode="cover" />
				{(width && height) ? (
					<Text style={styles.meta}>{`원본 크기: ${width}×${height}`}</Text>
				) : null}
			</View>

			{/* ===== 음식목록 섹션(더미데이터 렌더링) ===== */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>
					<Text style={styles.underline}>음식목록</Text>
				</Text>

				{foodList.map((item, i) => (
					<View key={`${item.name}-${i}`} style={styles.foodRow}>
						<Text style={styles.foodName}>{item.name}</Text>
						<View style={styles.foodRight}>
							<Text style={styles.foodWeight}>{item.amount} g</Text>
							<TouchableOpacity style={styles.plusBtn} onPress={() => onPressAdd(i)}>
								<Text style={styles.plusText}>＋</Text>
							</TouchableOpacity>
						</View>
					</View>
				))}
			</View>

			{/* ===== 합계 박스 ===== */}
			<View style={styles.totalCard}>
				<View style={styles.badgeRow}>
					<View style={styles.badge}>
						<Text style={styles.badgeLabel}>탄</Text>
					</View>
					<Text style={styles.badgeValue}>{totalMacros.carbs}g</Text>

					<View style={styles.badge}>
						<Text style={styles.badgeLabel}>단</Text>
					</View>
					<Text style={styles.badgeValue}>{totalMacros.protein}g</Text>
				</View>

				<View style={[styles.badgeRow, { marginTop: 8 }]}>
					<View style={styles.badge}>
						<Text style={styles.badgeLabel}>지</Text>
					</View>
					<Text style={styles.badgeValue}>{totalMacros.fat}g</Text>

					<View style={styles.badge}>
						<Text style={styles.badgeLabel}>당</Text>
					</View>
					<Text style={styles.badgeValue}>{totalMacros.sugar}g</Text>
				</View>

				<View style={styles.kcalRow}>
					<Text style={styles.kcalBig}>총 {totalMacros.kcal}</Text>
					<Text style={styles.kcalUnit}>kcal</Text>
				</View>
			</View>

			{/* ===== 기록 버튼 ===== */}
			<TouchableOpacity style={styles.primaryBtn} onPress={onPressRecord}>
				<Text style={styles.primaryBtnText}>기록</Text>
			</TouchableOpacity>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
		paddingBottom: 100,
		backgroundColor: BGCOLOR, // 캡쳐 배경 톤과 유사
	},
	pageTitle: {
		color: '#cfd3d8',
		fontSize: 16,
		marginBottom: 8,
	},
	imageCard: {
		backgroundColor: '#ffffff',
		borderRadius: 14,
		padding: 10,
		marginBottom: 14,
	},
	image: {
		width: '100%',
		height: 260,
		borderRadius: 8,
	},
	meta: {
		color: '#666',
		fontSize: 12,
		marginTop: 6,
		textAlign: 'right',
	},
	section: {
		backgroundColor: '#ffffff',
		borderRadius: 14,
		paddingHorizontal: 12,
		paddingVertical: 14,
		marginBottom: 22,
	},
	sectionTitle: {
		fontFamily: MAIN_FONT,
		fontSize: 18,
		marginBottom: 8,
		color: '#111',
	},
	underline: {
		textDecorationLine: 'underline',
		textDecorationColor: '#2c6fff',
		textDecorationStyle: 'solid',
	},
	foodRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#f2f4f7',
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		marginBottom: 10,
	},
	foodName: {
		fontSize: 16,
		color: '#1f2937',
	},
	foodRight: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	foodWeight: {
		fontSize: 15,
		color: '#6b7280',
		marginRight: 10,
	},
	plusBtn: {
		width: 34,
		height: 34,
		borderRadius: 17,
		backgroundColor: '#e9ecf1',
		alignItems: 'center',
		justifyContent: 'center',
	},
	plusText: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#6b7280',
	},
	/* 합계 카드 */
	totalCard: {
		backgroundColor: '#ffffff',
		borderRadius: 14,
		padding: 16,
		marginBottom: 12,
	},
	badgeRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 10,
		marginLeft: 24,
	},
	badge: {
		width: 34,
		height: 34,
		borderRadius: 17,
		backgroundColor: '#ffd9e0',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 6,
	},
	badgeLabel: {
		fontWeight: 'bold',
		color: '#222',
	},
	badgeValue: {
		marginRight: 24,
		fontSize: 16,
		color: '#111',
	},
	kcalRow: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'center',
		marginTop: 14,
	},
	kcalBig: {
		fontSize: 28,
		fontWeight: '900',
		marginRight: 6,
	},
	kcalUnit: {
		fontSize: 18,
		fontWeight: '600',
	},
	/* 기록 버튼 */
	primaryBtn: {
		backgroundColor: '#8ea0ff',
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: 'center',
		marginBottom: 16,
	},
	primaryBtnText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 18,
		letterSpacing: 1,
	},
	/* 기존 분석 섹션 공용 */
	title: {
		fontFamily: MAIN_FONT,
		fontSize: 18,
		marginBottom: 8,
		color: '#fff',
	},
	center: {
		alignItems: 'center',
	},
	gray: {
		color: '#cbd5e1',
		marginTop: 8,
	},
	card: {
		padding: 14,
		borderRadius: 12,
		backgroundColor: '#f3f5f7',
	},
	row: {
		fontSize: 16,
		marginBottom: 6,
	},
	rowBold: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 6,
	},
	divider: {
		height: 1,
		backgroundColor: '#e5e7eb',
		marginVertical: 10,
	},
	error: {
		color: '#ff6b6b',
	},
});

export default FoodInfoScreen;
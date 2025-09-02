// src/screens/food/FoodInfoScreen.jsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import Config from 'react-native-config'; // 없으면 npm install 필요
import { useSession } from '../../session/SessionProvider';
import Colors from '../../constants/colors';
import { auth } from '../../session/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithCustomToken } from 'firebase/auth';

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
	const [foodList, setFoodList] = useState([]);

	// 합계 예시(더미)
	const [totalMacros, setTotalMacros] = useState({ carbs: 0, protein: 0, fat: 0, sugar: 0, kcal: 0 });

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

	// 공통: 인증 토큰 확보 (우선순위: Session idToken → Firebase currentUser → AsyncStorage → 서버 refresh)
	const getAuthToken = useCallback(async () => {
		try {
			// 1) SessionProvider에서 제공 시 우선 사용
			if (user?.idToken && typeof user.idToken === 'string') {
				console.log('[Auth] using session idToken', user.idToken.substring(0, 10) + '...');
				return user.idToken;
			}
		} catch {}

		// 2) Firebase currentUser 강제 갱신
		try {
			const current = auth.currentUser;
			if (current) {
				const fresh = await current.getIdToken(true);
				if (fresh) {
					await AsyncStorage.setItem('accessToken', fresh);
					console.log('[Auth] using firebase getIdToken', fresh.substring(0, 10) + '...');
					return fresh;
				}
			}
		} catch (e) {
			console.log('[Auth] getIdToken failed:', e?.message);
		}

		// 3) 저장된 토큰
		const stored = await AsyncStorage.getItem('accessToken');
		if (stored) {
			console.log('[Auth] using stored accessToken', stored.substring(0, 10) + '...');
			return stored;
		}

		// 4) 서버 refresh-token (user_id 존재 시)
		try {
			if (user?.user_id) {
				const res = await fetch(`${API_BASE_URL}/auth/firebase/refresh-token/${user.user_id}`);
				const data = await res.json();
				if (data?.firebase_token) {
					try {
						// 서버가 준 custom token으로 Firebase 로그인 → 진짜 ID token 획득
						await signInWithCustomToken(auth, data.firebase_token);
						const idToken = await auth.currentUser?.getIdToken(true);
						if (idToken) {
							await AsyncStorage.setItem('accessToken', idToken);
							console.log('[Auth] signed in with custom token, got idToken', idToken.substring(0, 10) + '...');
							return idToken;
						}
					} catch (e) {
						console.log('[Auth] signInWithCustomToken failed:', e?.message);
					}
				}
			}
		} catch (e) {
			console.log('[Auth] refresh-token failed:', e?.message);
		}

		console.log('[Auth] no token available');
		return null;
	}, [API_BASE_URL, user]);

	// 업로드 함수
	const uploadMealImage = useCallback(async ({ fileUri, fileName, mime, date, time, notes }) => {
		const form = new FormData();
		form.append('file', { uri: fileUri, name: fileName, type: mime });
		if (date) form.append('date', date);
		if (time) form.append('time', time);
		if (notes != null) form.append('notes', notes);

		// 토큰 확보
		const authToken = await getAuthToken();
		if (!authToken) {
			Alert.alert('인증 필요', '로그인이 필요합니다. 다시 시도해 주세요.');
			throw new Error('No auth token');
		}
		console.log('[Auth] Authorization preview', ('Bearer ' + authToken).substring(0, 20) + '...');

		const res = await fetch(`${API_BASE_URL}/ml/food`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${authToken}`,
				// Content-Type은 RN이 자동으로 multipart boundary를 넣도록 생략
			},
			body: form,
		});
		const status = res.status;
		let data = null;
		try {
			data = await res.json();
		} catch {}
		console.log('[AI] status', status);
		if (data) console.log('[AI] body', JSON.stringify(data).slice(0, 400));
		if (status < 200 || status >= 300) {
			throw new Error(`HTTP ${status}`);
		}
		return data;
	}, [API_BASE_URL, getAuthToken]);

	const onUpload = useCallback(async () => {
		if (!photoUri) {
			console.log('[AI] onUpload start but no photoUri');
			Alert.alert('오류', '사진 정보가 없습니다.');
			navigation.goBack();
			return;
		}
		try {
			console.log('[AI] onUpload start, photoUri:', photoUri, 'file:', fileName, 'mime:', mime);
			setLoading(true);
			setError(null);
			console.log('[AI] invoking uploadMealImage...');
			const data = await uploadMealImage({
				fileUri: photoUri,
				fileName,
				mime,
				date: todayStr,
				time: timeStr,
				notes: null,
			});
			setResult(data);

			// 응답 파싱: top_5_predictions의 food_name만 추출해 목록으로 표시
			const top5Source = Array.isArray(data?.top_5_predictions)
				? data.top_5_predictions
				: (Array.isArray(data?.data?.top_5_predictions) ? data.data.top_5_predictions : []);
			let names = top5Source.map((p) => p?.food_name).filter(Boolean);
			// fallback: 단일 예측값이 있을 때
			if (names.length === 0 && typeof data?.predicted_food === 'string' && data.predicted_food.length > 0) {
				names = [data.predicted_food];
			}
			if (names.length === 0) {
				console.log('[FoodInfo] Empty prediction list. Raw response:', JSON.stringify(data).slice(0, 500));
			}
			setFoodList(names.map((name) => ({ name, amount: 0 })));

			// 예측 목록에 대해 탄·단·지 일괄 로드
			if (names.length > 0) {
				await enrichListWithNutrition(names);
			}

			// 합계 초기화 (일괄 로드에서 재계산되므로 0으로 시작)
			setTotalMacros({ carbs: 0, protein: 0, fat: 0, sugar: 0, kcal: 0 });
		} catch (e) {
			console.error(e);
			setError(e.message);
			Alert.alert('AI 분석 실패', e.message);
		} finally {
			setLoading(false);
		}
	}, [photoUri, fileName, mime, todayStr, timeStr, uploadMealImage, enrichListWithNutrition, navigation]);

	// 화면 진입 시 한 번 업로드 실행
	useEffect(() => {
		console.log('[AI] useEffect -> onUpload()');
		onUpload();
	}, [onUpload]);

	// 특정 음식 이름으로 CSV 영양정보를 서버에서 조회
	const fetchNutritionByFood = useCallback(async (foodName) => {
		try {
			// 신규 스펙: /ml/nutrition?food={음식명}
			let url = `${API_BASE_URL}/ml/nutrition?food=${encodeURIComponent(foodName)}`;
			let res = await fetch(url);
			if (!res.ok) {
				// 구형/대체 경로도 시도
				const alt1 = `${API_BASE_URL}/ml/nutrition?food_name=${encodeURIComponent(foodName)}`;
				res = await fetch(alt1);
			}
			if (!res.ok) {
				const alt2 = `${API_BASE_URL}/ml/nutrition/${encodeURIComponent(foodName)}`;
				res = await fetch(alt2);
			}
			if (!res.ok) {
				const t = await res.text().catch(() => '');
				throw new Error(`영양정보 조회 실패: HTTP ${res.status} ${t}`);
			}
			const raw = await res.json();
			// 필드 매핑: energy_kcal, carbohydrate_g, protein_g, sugars_g, fat_g → 앱 표준 키로 변환
			return {
				food_name: raw?.food_name ?? foodName,
				kcal: Number(raw?.energy_kcal ?? raw?.kcal ?? raw?.calories ?? 0),
				carbs: Number(raw?.carbohydrate_g ?? raw?.carbs ?? 0),
				protein: Number(raw?.protein_g ?? raw?.protein ?? 0),
				sugar: Number(raw?.sugars_g ?? raw?.sugar ?? 0),
				fat: Number(raw?.fat_g ?? raw?.fat ?? 0),
				amount: Number(raw?.amount ?? 0),
				raw,
			};
		} catch (err) {
			throw err;
		}
	}, [API_BASE_URL]);

	// 예측된 목록에 대해 탄·단·지 일괄 로드
	const enrichListWithNutrition = useCallback(async (names) => {
		try {
			const results = await Promise.all(names.map(async (name) => {
				try {
					const info = await fetchNutritionByFood(name);
					return { name,
						amount: Number(info?.amount ?? 0),
						carbs: Number(info?.carbs ?? 0),
						protein: Number(info?.protein ?? 0),
						fat: Number(info?.fat ?? 0),
						sugar: Number(info?.sugar ?? 0),
						kcal: Number(info?.kcal ?? info?.calories ?? 0) };
				} catch {
					return { name, amount: 0 };
				}
			}));
			setFoodList(results);
			// 합계 계산
			const sum = results.reduce((acc, it) => {
				acc.carbs += Number(it.carbs ?? 0);
				acc.protein += Number(it.protein ?? 0);
				acc.fat += Number(it.fat ?? 0);
				acc.sugar += Number(it.sugar ?? 0);
				acc.kcal += Number(it.kcal ?? 0);
				return acc;
			}, { carbs: 0, protein: 0, fat: 0, sugar: 0, kcal: 0 });
			setTotalMacros(sum);
		} catch (e) {
			console.log('[FoodInfo] enrich error', e?.message);
		}
	}, [fetchNutritionByFood]);

	// 분석 결과를 최종 업로드(등록)
	const uploadFinalRecord = useCallback(async () => {
		try {
			if (!photoUri) throw new Error('사진이 없습니다.');
			setLoading(true);
			const form = new FormData();
			form.append('file', { uri: photoUri, name: fileName, type: mime });
			form.append('date', todayStr);
			form.append('time', timeStr);
			form.append('foods', JSON.stringify(foodList));
			form.append('totals', JSON.stringify(totalMacros));

			const authToken = await getAuthToken();
			if (!authToken) {
				Alert.alert('인증 필요', '로그인이 필요합니다. 다시 시도해 주세요.');
				return;
			}
			console.log('[Auth] Authorization preview', ('Bearer ' + authToken).substring(0, 20) + '...');

			const res = await fetch(`${API_BASE_URL}/meals/upload`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${authToken}`,
					// Content-Type 생략(multipart boundary 자동)
				},
				body: form,
			});
			if (!res.ok) {
				const t = await res.text().catch(() => '');
				throw new Error(`등록 실패: HTTP ${res.status} ${t}`);
			}
			Alert.alert('완료', '식사가 등록되었습니다.');
		
		} catch (e) {
			Alert.alert('등록 실패', e?.message || String(e));
		} finally {
			setLoading(false);
		}
	}, [photoUri, fileName, mime, todayStr, timeStr, foodList, totalMacros, API_BASE_URL, getAuthToken]);

	// 행의 + 버튼 동작: 해당 음식의 영양정보를 불러와 목록/합계에 반영
	const onPressAdd = useCallback(async (idx) => {
		try {
			const target = foodList[idx];
			if (!target) return;
			setLoading(true);
			const info = await fetchNutritionByFood(target.name);
			// 예상 응답: { carbs, protein, fat, sugar, kcal, amount }
			const carbs = Number(info?.carbs ?? 0);
			const protein = Number(info?.protein ?? 0);
			const fat = Number(info?.fat ?? 0);
			const sugar = Number(info?.sugar ?? 0);
			const kcal = Number(info?.kcal ?? info?.calories ?? 0);
			const amount = Number(info?.amount ?? 0);

			// 아이템 상세 반영
			setFoodList((prev) => {
				const next = [...prev];
				next[idx] = { ...next[idx], carbs, protein, fat, sugar, kcal, amount };
				return next;
			});

			// 합계 업데이트
			setTotalMacros((prev) => ({
				carbs: prev.carbs + carbs,
				protein: prev.protein + protein,
				fat: prev.fat + fat,
				sugar: prev.sugar + sugar,
				kcal: prev.kcal + kcal,
			}));
		} catch (e) {
			Alert.alert('추가 실패', e?.message || String(e));
		} finally {
			setLoading(false);
		}
	}, [foodList, fetchNutritionByFood]);

	const onPressRecord = useCallback(() => {
		uploadFinalRecord();
	}, [uploadFinalRecord]);

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
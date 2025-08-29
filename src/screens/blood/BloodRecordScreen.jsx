import React, { useState, useEffect, useCallback } from 'react';
import { Image, StyleSheet, Text, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateHeader from '../../components/DateHeader';
import { Grid, Row, Col } from 'react-native-easy-grid';
import BloodSugarRegister from '../../components/BloodSugarRegister';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../constants/colors';
import Config from 'react-native-config';
import { useSession } from '../../session/SessionProvider';
import { auth } from '../../session/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAIN_FONT = 'ONE Mobile POP OTF';
const BGCOLOR = Colors.key.background;
const BASE_URL = Config.API_BASE_URL;

const BloodRecordScreen = () => {
	const insets = useSafeAreaInsets();
	const navigation = useNavigation();
	const { token, user, idToken } = useSession();

	const [selectedDate, setSelectedDate] = useState(new Date());
	const [dailyBloodSugar, setDailyBloodSugar] = useState({
		wakeup: null,
		morning: null,
		noon: null,
		evening: null
	});
	const [loading, setLoading] = useState(false);

	// 날짜 포맷팅 함수
	const formatDate = (date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	// 인증 토큰 가져오기
	const getAuthToken = useCallback(async () => {
		if (idToken) {
			return idToken;
		}
		
		try {
			const current = auth.currentUser;
			if (current) {
				const fresh = await current.getIdToken(true);
				if (fresh) {
					return fresh;
				}
			}
		} catch (e) {
			console.log('[DEBUG] firebase currentUser getIdToken failed:', e?.message);
		}

		const authToken = token || (await AsyncStorage.getItem('accessToken'));
		return authToken;
	}, [idToken, token]);

	// 선택된 날짜의 혈당 데이터 가져오기
	const fetchDailyBloodSugar = useCallback(async (date) => {
		try {
			setLoading(true);
			const authToken = await getAuthToken();
			
			if (!authToken) {
				console.log('[DEBUG] No auth token available');
				return;
			}

			const dateStr = formatDate(date);
			const headers = { 
				'Content-Type': 'application/json', 
				Authorization: `Bearer ${authToken}` 
			};

			console.log('[DEBUG] Fetching daily blood sugar for:', dateStr);
			
			const res = await fetch(`${BASE_URL}/blood-sugar/daily/${dateStr}`, { 
				method: 'GET', 
				headers 
			});

			if (res.ok) {
				const data = await res.json();
				console.log('[DEBUG] Daily blood sugar data:', data);
				
				// 시간대별로 데이터 정리
				const dailyData = {
					wakeup: null,
					morning: null,
					noon: null,
					evening: null
				};

				data.forEach(item => {
					switch (item.meal_type) {
						case '기상직후':
							dailyData.wakeup = item.blood_sugar;
							break;
						case '아침':
							dailyData.morning = item.blood_sugar;
							break;
						case '점심':
							dailyData.noon = item.blood_sugar;
							break;
						case '저녁':
							dailyData.evening = item.blood_sugar;
							break;
					}
				});

				setDailyBloodSugar(dailyData);
			} else {
				console.log('[DEBUG] Failed to fetch daily blood sugar:', res.status);
			}
		} catch (error) {
			console.error('[DEBUG] Error fetching daily blood sugar:', error);
		} finally {
			setLoading(false);
		}
	}, [getAuthToken]);

	// 날짜 변경 시 혈당 데이터 다시 가져오기
	useEffect(() => {
		fetchDailyBloodSugar(selectedDate);
	}, [selectedDate, fetchDailyBloodSugar]);

	// 하루 혈당 통합 정보 계산
	const getDailySummary = () => {
		const values = Object.values(dailyBloodSugar).filter(v => v !== null);
		if (values.length === 0) return { count: 0, average: 0, total: 0 };

		const total = values.reduce((sum, val) => sum + val, 0);
		const average = Math.round(total / values.length);
		
		return {
			count: values.length,
			average: average,
			total: total
		};
	};

	const dailySummary = getDailySummary();

	return (
		<View style={[styles.screenContainer, {paddingTop: insets.top,}]}>
			<View style={styles.topContainer}>
				<DateHeader
					initialDate={selectedDate}
					onDateChange={(date) => {
						setSelectedDate(date);
					}}
				/>
				<Text style={styles.topLabel}>오늘 하루 </Text>
				<Text style={styles.totalCalLabel}>
					<Text style={styles.calLabel}>{dailySummary.count}</Text> / 4회 측정
				</Text>
				<View style={styles.sugarLabel}>
					<Text style={styles.sugarLabelPoint}>평균</Text>
					<Text style={styles.sugarRatio}> {dailySummary.average} mg/dL</Text>
				</View>
				
			</View>
			<View style={styles.bottomContainer}>
				<Text style={styles.bottomLabel}>혈당</Text>
				<Grid style={styles.grid}>
					<Row>
						<Col style={styles.col}>
							<BloodSugarRegister
								icon='wakeup'
								value={dailyBloodSugar.wakeup}
								onPress={() => navigation.navigate('BloodSugarAddScreen', {time: 'wakeup', selectedDate: selectedDate})}
							/>
						</Col>
						<Col style={styles.col}>
							<BloodSugarRegister
								icon='morning'
								value={dailyBloodSugar.morning}
								onPress={() => navigation.navigate('BloodSugarAddScreen', {time: 'morning', selectedDate: selectedDate})}
							/>
						</Col>
					</Row>
					<Row>
						<Col style={styles.col}>
							<BloodSugarRegister
								icon='noon'
								value={dailyBloodSugar.noon}
								onPress={() => navigation.navigate('BloodSugarAddScreen', {time: 'noon', selectedDate: selectedDate})}
							/>
						</Col>
						<Col style={styles.col}>
							<BloodSugarRegister
								icon='evening'
								value={dailyBloodSugar.evening}
								onPress={() => navigation.navigate('BloodSugarAddScreen', {time: 'evening', selectedDate: selectedDate})}
							/>
						</Col>
					</Row>
				</Grid>
			</View>
			<Image
				pointerEvents="none"
				source={require('../../assets/images/character_in_bloodscreen.png')}
				style={styles.charImg}	
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	screenContainer: {
		width: "100%",
		height: "100%",
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingBottom: 120,
		position: 'relative',
		backgroundColor: BGCOLOR,
	},
	topBar: {
		width: "100%",
		height: 60,
		backgroundColor: "#fff",
		textAlign: "center",
		justifyContent: "center",
	},
	topContainer: {
		width: '100%',
		zIndex: 2,
		elevation: 2,
	},
	topLabel: {
		fontSize: 20,
		fontFamily: MAIN_FONT,
		padding: 20,
	},
	calLabel: {
		color: "black",
	},
	totalCalLabel: {
		color: "#929EFF",
		fontFamily: MAIN_FONT,
		fontSize: 30,
		textAlign: 'center',
	},
	sugarLabel: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 20,
	},
	sugarLabelPoint: {
		fontSize: 18,
		fontFamily: MAIN_FONT,
		color: '#929EFF',
		backgroundColor: '#fff',
		textAlign: 'center',
		padding: 5,
		borderRadius: 50,
		width: 30,
		aspectRatio: 1,
	},
	sugarRatio: {
		fontSize: 20,
		fontFamily: MAIN_FONT,
	},
	charImg: {
		position: 'absolute',
		top: 0,
		right: 10,
		width: '20%',
		resizeMode: 'contain',
		zIndex: 0,
	},
	bottomContainer: {
		backgroundColor: '#B7D4FF',
		width: '90%',
		height: 400,
		borderRadius: 10,
	},
	bottomLabel: {
		padding: 24,
		fontFamily: MAIN_FONT,
		color: '#fff',
		fontSize: 20,
	},
	grid: {
		paddingTop: 0,
		paddingBottom: 20,
		paddingHorizontal: 20,
		
	},
	col: {
		padding: 10,
	},
})

export default BloodRecordScreen;
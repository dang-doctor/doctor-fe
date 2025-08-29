import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/colors';
import Config from 'react-native-config';
import { useSession } from '../../session/SessionProvider';
import WeeklyCaloriesChart from '../../components/WeeklyCaloriesChart';

const API_URL = Config.API_BASE_URL;
const MAIN_FONT = 'ONE Mobile POP OTF';
const BGCOLOR = Colors.key.background;

const ChartScreen = () => {
	
	const [mode, setMode] = useState('weekly');
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const { isReady, user } = useSession();

	const calList = [1800, 1200, 800, 1600, 2000, 1400, 1000];
	const calAvg = calList.reduce((sum, v) => sum + v, 0) / calList.length;

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const res = await fetch(`${API_URL}/stats/nutrition?period=${mode}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': user.firebase_token,
					},
				});
				if (!res.ok) {
					const text = await res.text();
					throw new Error(`HTTP ${res.status}: ${text}`);
				}
				const data = await res.json();
				return data;
			} catch(error) {
				console.error(error);
			}
		};
		fetchData()
		.then((d) => {
			setData(d);

		})
		.then(() => {
			console.log(data);
		}).then(() => {
			setLoading(false);
		}).catch((e) => {
			console.error(e);
		});
	}, [isReady, user, mode]);

	return (
		<View style={styles.container}>
			<Text style={styles.headerText}>식단 정보</Text>
			<View style={styles.modeToggleRow}>
				<TouchableOpacity
					style={[styles.modeButton, mode === 'weekly' ? styles.modeButtonActive : styles.modeButtonInactive]}
					onPress={()=> setMode('weekly')}
				>
					<Text style={[styles.modeButtonText, mode === 'weekly' ? styles.modeButtonTextActive : styles.modeButtonTextInactive]}>주</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.modeButton, mode === 'monthly' ? styles.modeButtonActive : styles.modeButtonInactive]}
					onPress={()=> setMode('monthly')}
				>
					<Text style={[styles.modeButtonText, mode === 'monthly' ? styles.modeButtonTextActive : styles.modeButtonTextInactive]}>월</Text>
				</TouchableOpacity>
			</View>
			{
				loading ? (
					<View style={styles.contentWrapper}>
						<Text style={styles.statusText}>불러오는 중...</Text>
					</View>
				) : (
					<ScrollView
						contentContainerStyle={{ paddingHorizontal: 30, paddingVertical: 30, alignItems: 'center' }}
					>
						<WeeklyCaloriesChart
							height={160}
							values={calList}
						/>
						<View style={styles.rowContainer} >
							<View style={styles.rowComponent}>
								<Text style={styles.avgLabel}>평균 칼로리</Text>
								<Text style={styles.avgText}>
									<Text style={styles.avgNumber}>{calAvg}</Text>kcal
								</Text>
							</View>
							<View style={styles.rowComponent}>
								<Text style={styles.avgLabel}>평균 당류</Text>
								<Text style={styles.avgText}>
									<Text style={styles.avgNumber}>{calAvg}</Text>g
								</Text>
							</View>
							
						</View>
					</ScrollView>
				)
			}
			

		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: BGCOLOR,
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
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	modeToggleRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		paddingVertical: 12,
		backgroundColor: '#fff',
	},
	modeButton: {
		minWidth: 140,
		height: 44,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modeButtonActive: {
		backgroundColor: '#6d8cff',
	},
	modeButtonInactive: {
		backgroundColor: '#d7dbe9',
	},
	modeButtonText: {
		fontFamily: MAIN_FONT,
		fontSize: 16,
	},
	modeButtonTextActive: { color: '#fff' },
	modeButtonTextInactive: { color: '#8089a7' },
	scrollView: {
		padding: 20,
	},
	rowContainer: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 15,
	},
	rowComponent: {
		backgroundColor: '#fff',
		width: '48%',
		borderRadius: 16,
	},
	avgLabel:{
		textAlign: 'center',
		fontSize: 14,
		padding: 10,
	},
	avgText:{
		textAlign: 'center',
		fontSize: 14,
		paddingBottom: 10,
	},
	avgNumber:{
		fontSize: 20,
		fontWeight: 600,
	}
});

export default ChartScreen;
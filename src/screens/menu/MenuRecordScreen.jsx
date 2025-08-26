import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Config from 'react-native-config';
import Colors from '../../constants/colors';

const API_URL = Config.API_BASE_URL;
const MAIN_FONT = 'ONE Mobile POP OTF';
const BGCOLOR = Colors.key.background;

const MenuRecordScreen = () => {

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(()=>{
		const fetchData = async () => {
			try {
				const res = await fetch(`${API_URL}/foods/`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				console.log('[fetch] status =', res.status);

				if (!res.ok) {
					// 서버가 200대가 아니면 텍스트로 먼저 꺼내서 확인
					const text = await res.text();
					throw new Error(`HTTP ${res.status}: ${text}`);
				}

				// 진짜 JSON인지 확인이 필요하면 try-catch로 분리
				const json = await res.json();
				return json;
				// return json; // ← 필요하면 반환
			} catch (e) {
				console.log('[fetch] error =', e?.message);
				setError(e);
			} finally {
				setLoading(false);
			}
		};

		fetchData()
		.then((d)=>{
			setData(d);
		})
		.then(()=>{
			console.log(data);
		});
	},[]);
	
	return (
		<View style={styles.container}>
			<Text style={styles.headerText}>식단 정보</Text>
			<View style={styles.buttonWrapper}>
				<TouchableOpacity
					style={styles.topButton}
					onPress={()=>{}}
				>
					<Text style={styles.topButtonText}>좋은음식</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.topButton}
					onPress={()=>{}}
				>
					<Text style={styles.topButtonText}>나쁜음식</Text>
				</TouchableOpacity>
			</View>
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
	buttonWrapper: {
		backgroundColor: '#fff',
		flexDirection: 'row',
		justifyContent: 'space-around',
		paddingHorizontal: 30,

	},
	topButton: {
		padding: 10,
		
	},
	topButtonText: {
		fontFamily: MAIN_FONT,
	},	
});

export default MenuRecordScreen;
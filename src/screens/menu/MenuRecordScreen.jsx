import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Config from 'react-native-config';
import Colors from '../../constants/colors';

const API_URL = Config.API_BASE_URL;
const MAIN_FONT = 'ONE Mobile POP OTF';
const BGCOLOR = Colors.key.background;

const MenuRecordScreen = () => {

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [mode, setMode] = useState('good'); // 'good' | 'bad'
	const [selectedCategory, setSelectedCategory] = useState('음식');

	useEffect(()=>{
		const fetchData = async () => {
			try {
				const res = await fetch(`${API_URL}/foods/${mode}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				if (!res.ok) {
					const text = await res.text();
					throw new Error(`HTTP ${res.status}: ${text}`);
				}

				const json = await res.json();
				setData(json);
			} catch (e) {
				setError(e);
			} finally {
				setLoading(false);
			}
		};

		setLoading(true);
		setError(null);
		fetchData();
	},[mode]);

	const categories = ['음식','간식','음료','과일'];
	const getItemsByCategory = (category) => {
		if (!Array.isArray(data)) return [];
		const group = data.find((g) => g?.category === category);
		return Array.isArray(group?.foods) ? group.foods : [];
	};

	const items = getItemsByCategory(selectedCategory);

	const onPressItem = (item) => {
		// 추후 상세 정보 표시를 위한 클릭 핸들러 자리
		// 예: navigation.navigate('FoodDetail', { item })
		console.log('[food-click]', item?.id);
	};
	
	if (loading) {
		return (
			<View style={styles.container}>
				<Text style={styles.headerText}>식단 정보</Text>
				<View style={styles.contentWrapper}>
					<Text style={styles.statusText}>불러오는 중...</Text>
				</View>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.container}>
				<Text style={styles.headerText}>식단 정보</Text>
				<View style={styles.contentWrapper}>
					<Text style={styles.statusText}>오류: {error?.message}</Text>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.headerText}>식단 정보</Text>
			{/* 상단 Good/Bad 토글 */}
			<View style={styles.modeToggleRow}>
				<TouchableOpacity
					style={[styles.modeButton, mode === 'good' ? styles.modeButtonActive : styles.modeButtonInactive]}
					onPress={()=> setMode('good')}
				>
					<Text style={[styles.modeButtonText, mode === 'good' ? styles.modeButtonTextActive : styles.modeButtonTextInactive]}>좋은음식</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.modeButton, mode === 'bad' ? styles.modeButtonActive : styles.modeButtonInactive]}
					onPress={()=> setMode('bad')}
				>
					<Text style={[styles.modeButtonText, mode === 'bad' ? styles.modeButtonTextActive : styles.modeButtonTextInactive]}>나쁜음식</Text>
				</TouchableOpacity>
			</View>

			{/* 카테고리 탭 */}
			<View style={styles.tabRow}>
				{categories.map((cat) => (
					<TouchableOpacity
						key={cat}
						style={[styles.tabButton, selectedCategory === cat && styles.tabButtonActive]}
						onPress={()=> setSelectedCategory(cat)}
					>
						<Text style={[styles.tabText, selectedCategory === cat && styles.tabTextActive]}>{cat}</Text>
					</TouchableOpacity>
				))}
			</View>

			{/* 리스트 */}
			<ScrollView contentContainerStyle={styles.listContent}>
				{items.map((item) => (
					<TouchableOpacity key={item?.id} style={styles.cardRow} onPress={()=> onPressItem(item)}>
						<Text style={styles.itemName}>{item?.name}</Text>
						<View style={styles.rightWrap}>
							<View style={styles.giPill}><Text style={styles.giPillText}>GI : {Number(item?.gi_index ?? 0)}</Text></View>
							<View style={styles.plusCircle}><Text style={styles.plusText}>＋</Text></View>
						</View>
					</TouchableOpacity>
				))}
			</ScrollView>
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
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	scrollContent: {
		padding: 16,
		backgroundColor: '#fff',
	},
	modeToggleRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		paddingVertical: 12,
		backgroundColor: BGCOLOR,
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
	
	tabRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 8,
		backgroundColor: '#e6f0ff',
	},
	tabButton: {
		flex: 1,
		marginHorizontal: 6,
		height: 44,
		borderRadius: 12,
		backgroundColor: '#bcd3ff',
		justifyContent: 'center',
		alignItems: 'center',
	},
	tabButtonActive: {
		backgroundColor: '#6d8cff',
	},
	tabText: {
		fontFamily: MAIN_FONT,
		fontSize: 16,
		color: '#fff',
	},
	tabTextActive: {
		color: '#fff',
		fontWeight: '700',
	},
	listContent: {
		padding: 16,
		backgroundColor: '#e6f0ff',
	},
	statusText: {
		fontFamily: MAIN_FONT,
		fontSize: 16,
		color: '#333',
	},
	cardRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#fff',
		borderRadius: 14,
		paddingHorizontal: 16,
		height: 56,
		marginBottom: 12,
	},
	itemName: {
		fontFamily: MAIN_FONT,
		fontSize: 16,
		color: '#222',
	},
	rightWrap: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	giPill: {
		backgroundColor: '#f0f2f7',
		borderRadius: 16,
		paddingHorizontal: 12,
		paddingVertical: 6,
		marginRight: 8,
	},
	giPillText: {
		fontFamily: MAIN_FONT,
		fontSize: 14,
		color: '#8089a7',
	},
	plusCircle: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: '#f0f2f7',
		justifyContent: 'center',
		alignItems: 'center',
	},
	plusText: {
		fontFamily: MAIN_FONT,
		fontSize: 18,
		color: '#8a94ad',
		marginTop: -2,
	},
});

export default MenuRecordScreen;
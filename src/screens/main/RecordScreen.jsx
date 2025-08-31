// src/screens/record/RecordScreen.jsx
import React, { useMemo, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Config from 'react-native-config';
import CalendarDateButton from '../../components/CalendarDateButton';
import Colors from '../../constants/colors';

const API_URL = Config.API_BASE_URL;
const MAIN_FONT = 'ONE Mobile POP OTF';
const BGCOLOR = Colors.key.background;

const RecordScreen = () => {
	// ✅ 더미 데이터
	const nutrition = useMemo(() => ({
		calories: 1500,
		carbs: 55,
		protein: 23,
		fat: 40,
		sugar: 55,
	}), []);

	const todayMeals = useMemo(() => ([
		{
			id: 'meal-1',
			title: '토마토, 샐러드, 연어…',
			imageLocal: require('../../assets/images/sample.webp'),
			items: [
				{ name: '토마토', amount: 20 },
				{ name: '샐러드', amount: 100 },
				{ name: '연어', amount: 340 },
				{ name: '레몬', amount: 30 },
			],
		},
	]), []);

	// 바텀시트 상태
	const [visible, setVisible] = useState(false);
	const [selected, setSelected] = useState(null);

	const openSheet = (meal) => {
		setSelected(meal);
		setVisible(true);
	};
	const closeSheet = () => {
		setVisible(false);
		setSelected(null);
	};

	return (
		<View style={styles.container}>
			<View style={styles.topBar}>
				<Text style={styles.headerText}>식단 기록</Text>
			</View>

			<ScrollView contentContainerStyle={styles.scrollView}>
				<CalendarDateButton />

				{/* 영양 성분 카드 */}
				<View style={styles.card}>
					<Text style={styles.cardTitle}>영양 성분</Text>

					<View style={styles.row}>
						<Text style={styles.rowLabel}>칼로리</Text>
						<Text style={styles.rowValue}>{nutrition.calories} kcal</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.rowLabel}>탄수화물</Text>
						<Text style={styles.rowValue}>{nutrition.carbs} g</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.rowLabel}>단백질</Text>
						<Text style={styles.rowValue}>{nutrition.protein} g</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.rowLabel}>지방</Text>
						<Text style={styles.rowValue}>{nutrition.fat} g</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.rowLabel}>당류</Text>
						<Text style={styles.rowValue}>{nutrition.sugar} g</Text>
					</View>
				</View>

				{/* 오늘의 식단 카드 */}
				<View style={styles.card}>
					<Text style={styles.cardTitle}>오늘의 식단</Text>
					{todayMeals.map((m) => (
						<TouchableOpacity key={m.id} style={styles.mealItem} activeOpacity={0.8} onPress={ () => openSheet(m) }>
							<Image source={m.imageLocal} style={styles.mealThumb} />
							<View style={styles.mealTextBox}>
								<Text numberOfLines={1} style={styles.mealTitle}>{m.title}</Text>
							</View>
						</TouchableOpacity>
					))}
				</View>
			</ScrollView>

			{/* 바텀시트 모달 */}
			<Modal
				transparent
				visible={visible}
				animationType="slide"
				presentationStyle="overFullScreen"
				onRequestClose={closeSheet}
			>
				{/* 반투명 배경 눌러서 닫기 */}
				<Pressable style={styles.backdrop} onPress={closeSheet} />

				{/* 시트 본문 */}
				<View style={styles.sheet}>
					<View style={styles.sheetHandle} />
					{selected && (
						<View style={styles.sheetBody}>
							<Image source={selected.imageLocal} style={styles.sheetImage} />
							<View style={{ height: 10 }} />
							{selected.items.map((it, idx) => (
								<View key={`${it.name}-${idx}`} style={styles.itemRow}>
									<Text style={styles.itemName}>{it.name}</Text>
									<Text style={styles.itemAmount}>{it.amount}g</Text>
								</View>
							))}
						</View>
					)}
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { backgroundColor: BGCOLOR, flex: 1 },
	topBar: {
		backgroundColor: '#fff',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	headerText: {
		fontFamily: MAIN_FONT,
		fontSize: 20,
		color: '#111',
		backgroundColor: '#fff',
		height: 60,
		textAlignVertical: 'center',
		paddingLeft: 20,
	},
	scrollView: {
		backgroundColor: BGCOLOR,
		padding: 20,
		paddingBottom: 40,
	},

	card: {
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 16,
		marginTop: 16,
	},
	cardTitle: {
		fontFamily: MAIN_FONT,
		fontSize: 18,
		color: '#111',
		marginBottom: 12,
	},

	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#F2F4F7',
		borderRadius: 8,
		paddingVertical: 10,
		paddingHorizontal: 14,
		marginBottom: 8,
	},
	rowLabel: { fontSize: 15, color: '#333' },
	rowValue: { fontSize: 15, color: '#000' },

	mealItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	mealThumb: {
		width: 60,
		height: 60,
		borderRadius: 8,
		backgroundColor: '#ddd',
	},
	mealTextBox: {
		flex: 1,
		marginLeft: 10,
	},
	mealTitle: {
		fontSize: 15,
		color: '#111',
	},

	// 바텀시트
	backdrop: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.35)',
	},
	sheet: {
		backgroundColor: '#fff',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingHorizontal: 16,
		paddingTop: 8,
		paddingBottom: 24,
		// 화면 하단 배치
		marginTop: 'auto',
		// 그림자
		shadowColor: '#000',
		shadowOpacity: 0.12,
		shadowOffset: { width: 0, height: -4 },
		shadowRadius: 12,
		elevation: 8,
	},
	sheetHandle: {
		alignSelf: 'center',
		width: 60,
		height: 6,
		borderRadius: 3,
		backgroundColor: '#E2E6ED',
		marginBottom: 10,
	},
	sheetBody: {
		alignItems: 'center',
	},
	sheetImage: {
		width: 140,
		height: 90,
		borderRadius: 10,
		backgroundColor: '#ddd',
	},

	itemRow: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#F2F4F7',
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 14,
		marginTop: 10,
	},
	itemName: { fontSize: 15, color: '#111' },
	itemAmount: { fontSize: 15, color: '#111' },
});

export default RecordScreen;
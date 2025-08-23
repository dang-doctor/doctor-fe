import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const MAIN_FONT = 'ONE Mobile POP OTF';

const ITEM_WIDTH = 96;
const SPACING = 20; // ← 버튼 사이 간격
const CELL = ITEM_WIDTH + SPACING;

const TIMES = [
	{ key: 'wakeup', label: '기상직후' },
	{ key: 'morning', label: '아침' },
	{ key: 'noon', label: '점심' },
	{ key: 'evening', label: '저녁' },
];

const clamp = (v, min, max) => Math.max(min, Math.min(v, max));

const TimeSelectorRow = ({ initialKey = 'wakeup', onPick }) => {
	const listRef = useRef(null);
	const count = TIMES.length;

	const initialIndex = useMemo(
		() => Math.max(0, TIMES.findIndex((t) => t.key === initialKey)),
		[initialKey]
	);

	const [selectedIndex, setSelectedIndex] = useState(initialIndex);
	const [viewportW, setViewportW] = useState(0); // 실제 리스트 뷰포트 폭
	const [contentW, setContentW] = useState(0);   // 콘텐츠 총 폭

	const getItemLayout = (_data, index) => {
		return { length: CELL, offset: CELL * index, index };
	};

	const scrollSmartToIndex = (index) => {
		if (!listRef.current || viewportW <= 0) return;

		// 중앙 기준 이상적 오프셋
		const itemCenter = index * CELL + CELL / 2;
		const ideal = itemCenter - viewportW / 2;

		// 끝에서 빈 공간 방지
		const maxOffset = Math.max(0, contentW - viewportW);
		if (contentW <= viewportW) return;

		const target = clamp(ideal, 0, maxOffset);
		listRef.current.scrollToOffset({ offset: target, animated: true });
	};

	const handlePress = (index) => {
		setSelectedIndex(index);
		scrollSmartToIndex(index);
		onPick?.(TIMES[index].key);
	};

	const renderItem = ({ item, index }) => {
		const active = index === selectedIndex;
		return (
			<TouchableOpacity
				style={[styles.item, active && styles.itemActive]}
				onPress={() => handlePress(index)}
				activeOpacity={0.8}
				accessibilityRole="button"
				accessibilityState={{ selected: active }}
				accessibilityLabel={item.label}
			>
				<Text style={[styles.itemText, active && styles.itemTextActive]}>{item.label}</Text>
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.wrap}>
			<FlatList
				ref={listRef}
				horizontal
				data={TIMES}
				keyExtractor={(it) => it.key}
				renderItem={renderItem}
				showsHorizontalScrollIndicator={false}
				getItemLayout={getItemLayout}
				initialScrollIndex={initialIndex}
				decelerationRate="fast"
				// 간격: Separator로만 관리 (item 마진 제거)
				ItemSeparatorComponent={() => <View style={{ width: 30 }} />}
				// 실제 뷰포트 폭/콘텐츠 폭 실측
				onLayout={(e) => setViewportW(e.nativeEvent.layout.width)}
				onContentSizeChange={(w /*, h */) => setContentW(w)}
				// 양끝 여백은 별도 패딩 없이 0 유지 (끝에서 빈 공간 X)
				contentContainerStyle={{ paddingHorizontal: 0 }}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	wrap: {
		paddingVertical: 20,
		paddingHorizontal: 10,
		backgroundColor: '#fff',
	},
	item: {
		width: ITEM_WIDTH,
		paddingVertical: 10,
		borderRadius: 10,
		backgroundColor: '#DEDEDE',
		justifyContent: 'center',
		alignItems: 'center',
	},
	itemActive: {
		backgroundColor: '#929EFF',
	},
	itemText: {
		fontSize: 14,
		color: '#fff',
		fontFamily: MAIN_FONT,
	},
	itemTextActive: {
		color: '#fff',
		fontFamily: MAIN_FONT,
	},
});

export default TimeSelectorRow;
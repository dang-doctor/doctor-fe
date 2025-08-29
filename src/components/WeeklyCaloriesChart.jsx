import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const SCREEN_WIDTH = Dimensions.get('window').width;

// 기본 천단위 콤마 포맷터
const defaultFormatWithComma = (v) => {
	const n = Number(v);
	if (isNaN(n)) return v;
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const WeeklyCaloriesChart = ({
	labels = ['월', '화', '수', '목', '금', '토', '일'],
	values = [1800, 1200, 800, 1600, 2000, 1400, 1000],
	unitText = '[단위 : kcal]',
	width = SCREEN_WIDTH - 64,			// 차트 폭
	height = 220,							// 차트 높이
	barColor = '#5B8BF7',					// 막대 색상
	labelColor = 'rgba(23, 28, 41, 1)',	// 라벨(축) 색상
	gridColor = '#E6EEF8',					// 배경 격자선 색상
	cardStyle = {},							// 카드 컨테이너 커스텀
	formatYLabel = defaultFormatWithComma,	// Y축 라벨 포맷터
	fromZero = true,							// 0부터 시작
}) => {
	const data = {
		labels,
		datasets: [{ data: values }],
	};

	const [chartWidth, setChartWidth] = useState(width);
	const maxVal = Math.max(...values);
	const maxRounded = Math.ceil(maxVal / 1000) * 1000;
	const segments = Math.max(1, maxRounded / 1000);

	const chartConfig = {
		backgroundGradientFrom: '#FFFFFF',
		backgroundGradientTo: '#FFFFFF',
		decimalPlaces: 0,
		color: (opacity = 1) => `rgba(91, 139, 247, ${opacity})`,
		labelColor: () => labelColor,
		barPercentage: 0.7,
		propsForBackgroundLines: {
			strokeDasharray: '4 8',
			stroke: gridColor,
			strokeWidth: 1,
		},
		fillShadowGradient: barColor,
		fillShadowGradientOpacity: 1,
	};

	return (
		<View style={styles.wrapper}>
			<View
				style={[styles.card, cardStyle]}
				onLayout={(e) => {
					const cardW = e.nativeEvent.layout.width;
					// 카드 내부 패딩 등을 빼고 싶으면 여기서 -16 같은 보정
					setChartWidth(cardW - 16);
				}}
			>
				<BarChart
					data={data}
					width={chartWidth}
					height={height}
					fromZero={fromZero}
					withInnerLines
					showValuesOnTopOfBars={false}
					chartConfig={chartConfig}
					style={styles.chart}
					yAxisLabel={''}
					yAxisSuffix={''}
					verticalLabelRotation={0}
					formatYLabel={formatYLabel}
					segments={segments}
					xLabelsOffset={-5}
					yAxisLabelWidth={10}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		alignItems: 'center',
		width: '100%',
	},
	card: {
		width: '100%',
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		paddingVertical: 12,
		paddingHorizontal: 0,
		// shadowColor: '#000',
		// shadowOpacity: 0.05,
		// shadowRadius: 8,
		// shadowOffset: { width: 0, height: 4 },
		// elevation: 2,
	},
	unit: {
		position: 'absolute',
		right: 10,
		top: 10,
		fontSize: 12,
		color: '#7C8A9A',
	},
	chart: {
		marginTop: 5,
		borderRadius: 16,
	},
});

export default WeeklyCaloriesChart;

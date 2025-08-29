// components/BloodLineChart.jsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MAIN_FONT = 'ONE Mobile POP OTF';

const toEven = (n) => {
	const v = Math.floor(Number(n) || 0);
	return v % 2 === 0 ? v : v - 1;
};

const BloodLineChart = ({
	title = '공복/식전 혈당',
	labels = ['월', '화', '수', '목', '금', '토', '일'],
	dataSets = [],						// [{ label, values, color(o), strokeWidth }]
	cardPadding = 10,					// 카드 내부 패딩
	chartWidth = SCREEN_WIDTH - 90,		// 차트 고정 폭
	chartHeight = 220,					// 차트 높이
	offsetX = -30,						// 오른쪽(+) / 왼쪽(-)으로 플롯 이동 (paddingLeft/right로 보정)
	offsetRight = 0,					// 오른쪽 패딩(양수면 더 남김)
	segments = 4,						// Y축 분할선 개수
	showLegend = true,					// 커스텀 범례 표시
}) => {
	const width = toEven(chartWidth);
	const padLeft = toEven(offsetX);	// chart-kit은 paddingLeft로 플롯을 ‘오른쪽’으로 밀 수 있음
	const padRight = toEven(offsetRight);

	const data = {
		labels,
		legend: dataSets.map((d) => d.label),
		datasets: dataSets.map((d) => ({
			data: d.values,
			color: d.color,
			strokeWidth: d.strokeWidth || 2,
		})),
	};

	const chartConfig = {
		backgroundColor: '#ffffff',
		backgroundGradientFrom: '#ffffff',
		backgroundGradientTo: '#ffffff',
		decimalPlaces: 0,
		color: (o = 1) => `rgba(120,132,158,${o})`,	// 축/그리드 색
		labelColor: (o = 1) => `rgba(51,51,51,${o})`,
		propsForDots: { r: '2' },
		propsForBackgroundLines: { strokeDasharray: '6 6', strokeWidth: 1 },
		useShadowColorFromDataset: false,
	};

	return (
		<View style={[styles.card, { padding: cardPadding }]}>
			<Text style={styles.title}>{title}</Text>

			<LineChart
				data={data}
				width={width}
				height={chartHeight}
				chartConfig={chartConfig}
				// bezier
				withShadow={false}
				withDots={true}           // 필요 시 점 유지
				withInnerLines
				withOuterLines={false}
				segments={segments}
				yAxisInterval={1}
				fromZero={false}
				// PieChartCardForceShift의 고정 이동 개념을 여기선 padding으로 구현
				paddingLeft={padLeft}
				paddingRight={padRight}
				style={[styles.chart, [{ transform: [{ translateX: -5 }] }]]}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#fff',
		borderRadius: 16,
		marginHorizontal: 16,
		marginVertical: 12,
		width: '100%',
		padding: 16,
	},
	title: {
		// fontFamily: MAIN_FONT,
		fontWeight: 'bold',
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 8,
		color: '#1F2937',
	},
	legendRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
		justifyContent: 'center',
		marginBottom: 6,
	},
	legendItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	dot: {
		width: 14,
		height: 14,
		borderRadius: 7,
		marginRight: 6,
	},
	legendText: {
		fontSize: 13,
		color: '#333',
	},
	chart: {
		borderRadius: 12,
	},
});

export default BloodLineChart;
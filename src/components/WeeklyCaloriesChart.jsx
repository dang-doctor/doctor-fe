import React from 'react';
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
	width = SCREEN_WIDTH - 32,			// 차트 폭
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

	const chartConfig = {
		backgroundGradientFrom: '#FFFFFF',
		backgroundGradientTo: '#FFFFFF',
		decimalPlaces: 0,
		color: (opacity = 1) => `rgba(91, 139, 247, ${opacity})`,
		labelColor: () => labelColor,
		barPercentage: 0.55,
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
			<View style={[styles.card, cardStyle]}>
				<BarChart
					data={data}
					width={width}
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
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		alignItems: 'center',
	},
	card: {
		width: SCREEN_WIDTH - 16,
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		paddingVertical: 12,
		paddingHorizontal: 8,
		shadowColor: '#000',
		shadowOpacity: 0.05,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 4 },
		elevation: 2,
	},
	unit: {
		position: 'absolute',
		right: 14,
		top: 10,
		fontSize: 12,
		color: '#7C8A9A',
	},
	chart: {
		marginTop: 16,
		borderRadius: 16,
	},
});

export default WeeklyCaloriesChart;

// PieChartCardForceShift.jsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const toEven = (n) => {
	const v = Math.floor(Number(n) || 0);
	return v % 2 === 0 ? v : v - 1;
};

const PieChartCardForceShift = ({
	title = '탄 · 단 · 지 비율',
	carb = 0,
	protein = 0,
	fat = 0,
	chartSize = 200,			// 원의 지름(고정)
	offsetX = 0,				// 오른쪽(+) / 왼쪽(-) 이동
	offsetY = 0,				// 아래(+) / 위(-) 이동
	normalize = true,
}) => {
	let c = Math.max(0, Number(carb) || 0);
	let p = Math.max(0, Number(protein) || 0);
	let f = Math.max(0, Number(fat) || 0);
	const sum = c + p + f;
	if (normalize && sum > 0) {
		c = (c / sum) * 100;
		p = (p / sum) * 100;
		f = (f / sum) * 100;
	}

	const data = useMemo(() => ([
		{ name: '탄', population: c, color: '#cfe5ff', legendFontColor: '#333', legendFontSize: 14 },
		{ name: '단', population: p, color: '#9fc4ff', legendFontColor: '#333', legendFontSize: 14 },
		{ name: '지', population: f, color: '#5e8bff', legendFontColor: '#333', legendFontSize: 14 },
	]), [c, p, f]);

	const size = toEven(chartSize);			// 반픽셀 방지
	const cx = toEven(offsetX);
	const cy = toEven(offsetY);

	const round = (v) => Math.round(v);

	return (
		<View style={styles.card}>
			<Text style={styles.title}>{title}</Text>

			<View style={styles.row}>
				<View style={styles.legend}>
					<View style={styles.legendRow}>
						<View style={[styles.dot, { backgroundColor: '#cfe5ff' }]} />
						<Text style={styles.legendText}>탄 {round(c)}%</Text>
					</View>
					<View style={styles.legendRow}>
						<View style={[styles.dot, { backgroundColor: '#9fc4ff' }]} />
						<Text style={styles.legendText}>단 {round(p)}%</Text>
					</View>
					<View style={styles.legendRow}>
						<View style={[styles.dot, { backgroundColor: '#5e8bff' }]} />
						<Text style={styles.legendText}>지 {round(f)}%</Text>
					</View>
				</View>

				<View style={[styles.chartBox, { width: size, height: size }]}>
					<PieChart
						data={data}
						width={size}
						height={size}
						accessor="population"
						hasLegend={false}
						backgroundColor="transparent"
						paddingLeft="0"
						center={[cx, cy]}	// ← 원하는 만큼 '고정' 이동
						chartConfig={{
							backgroundColor: '#fff',
							backgroundGradientFrom: '#fff',
							backgroundGradientTo: '#fff',
							color: (o = 1) => `rgba(0,0,0,${o})`,
						}}
					/>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		width: '100%',
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 16,
		marginHorizontal: 16,
		marginVertical: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 6,
		elevation: 4,
		overflow: 'visible',
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 12,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	legend: {
		width: 120,
		paddingRight: 8,
	},
	legendRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	dot: {
		width: 22,
		height: 22,
		borderRadius: 11,
		marginRight: 10,
	},
	legendText: {
		fontSize: 15,
		fontWeight: '600',
	},
	chartBox: {
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default PieChartCardForceShift;

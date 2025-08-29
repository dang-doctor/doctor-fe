import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Col, Grid, Row } from 'react-native-easy-grid';

const BloodSugarSummaryCard = ({ wakeup, morning, noon, evening }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>혈당 전체</Text>
			<Grid style={styles.grid}>
				<Row>
					<Col style={styles.col}>
						<View style={styles.imgWrapper}>
							<Image
								style={styles.image}
								source={require('../assets/images/wakeup.png')}
							/>
							<Text style={styles.imgDescription}>기상직후</Text>
						</View>
						<Text style={styles.sugarAmountLabel}>
							<Text style={styles.sugarAmount}>123</Text>mg/dL
						</Text>
					</Col>
					<Col style={styles.col}>
						<View style={styles.imgWrapper}>
							<Image
								style={styles.image}
								source={require('../assets/images/morning.png')}
							/>
							<Text style={styles.imgDescription}>아침</Text>
						</View>
						<Text style={styles.sugarAmountLabel}>
							<Text style={styles.sugarAmount}>123</Text>mg/dL
						</Text>
					</Col>
				</Row>
				<Row>
					<Col style={styles.col}>
						<View style={styles.imgWrapper}>
							<Image
								style={styles.image}
								source={require('../assets/images/noon.png')}
							/>
							<Text style={styles.imgDescription}>점심</Text>
						</View>
						<Text style={styles.sugarAmountLabel}>
							<Text style={styles.sugarAmount}>123</Text>mg/dL
						</Text>
					</Col>
					<Col style={styles.col}>
						<View style={styles.imgWrapper}>
							<Image
								style={styles.image}
								source={require('../assets/images/evening.png')}
							/>
							<Text style={styles.imgDescription}>저녁</Text>
						</View>
						<Text style={styles.sugarAmountLabel}>
							<Text style={styles.sugarAmount}>123</Text>mg/dL
						</Text>
					</Col>
				</Row>
			</Grid>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		backgroundColor: '#fff',
		padding: 16,
		borderRadius: 16,
		margin: 10,
	},
	title: {
		textAlign: 'center',
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 12,
	},
	col: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 5,
	},
	imgWrapper: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
	},
	image: {
		width: 40,	
		height: 30,
		resizeMode: 'contain',
	},
	imgDescription: {
		textAlign: 'center',
		fontSize: 12,
	},
	sugarAmount: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	sugarAmountLabel: {
		fontSize: 12
	},
});

export default BloodSugarSummaryCard;
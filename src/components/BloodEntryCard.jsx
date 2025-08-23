// components/BloodEntryCard.jsx
// from BloodSugarAddScreen
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';

const pad2 = (n) => String(n).padStart(2, '0');
const formatTime = (d) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

const MAIN_FONT = 'ONE Mobile POP OTF';

const BloodEntryCard = ({
	label = '식전',
	initialGlucose = null,			// 숫자 또는 null
	initialTime = new Date(),		// Date 객체 (시/분만 사용)
	onChange,						// (payload) => void
}) => {
	const [visible, setVisible] = useState(false);
	const [pickerOpen, setPickerOpen] = useState(false);

	// 카드에 표시될 값(저장된 값)
	const [glucose, setGlucose] = useState(initialGlucose);
	const [time, setTime] = useState(() => {
		const base = initialTime instanceof Date ? initialTime : new Date();
		return new Date(base);
	});

	// 팝업 내부 편집용 값(확인 전까지는 카드에 적용 X)
	const [draftGlucose, setDraftGlucose] = useState(glucose?.toString() ?? '');
	const [draftTime, setDraftTime] = useState(new Date(time));

	const open = () => {
		setDraftGlucose(glucose?.toString() ?? '');
		setDraftTime(new Date(time));
		setVisible(true);
	};

	const close = () => setVisible(false);

	const handleSave = () => {
		const nextGlucose = draftGlucose === '' ? null : Number(draftGlucose);
		setGlucose(nextGlucose);
		setTime(new Date(draftTime));
		setVisible(false);

		onChange && onChange({
			label,
			glucose: nextGlucose,
			time: new Date(draftTime),
			timeText: formatTime(draftTime),
		});
	};

	const timeText = useMemo(() => formatTime(time), [time]);

	return (
		<>
			<TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={open}>
				<View style={styles.row}>
					<Text style={styles.label}>{label}</Text>
					<View style={styles.timeBadge}>
						<Ionicons name="time" size={16} color="#fff" />
						<Text style={styles.timeText}> {timeText.replace(':', ' : ')} </Text>
					</View>
				</View>

				<View style={styles.valueBox}>
					<Text style={styles.valueText}>
						{glucose == null ? '000' : glucose}
					</Text>
					<Text style={styles.unitText}>[단위 : mg/dL]</Text>
				</View>
			</TouchableOpacity>

			{/* 팝업(커스텀 UI) */}
			<Modal
				visible={visible}
				transparent
				animationType="fade"
				onRequestClose={close}
			>
				<View style={styles.backdrop}>
					<View style={styles.popup}>
						<View style={styles.popupHeader}>
							<Text style={styles.popupTitle}>혈당 추가</Text>
							<TouchableOpacity onPress={close} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
								<Ionicons name="close" size={22} color="#111" />
							</TouchableOpacity>
						</View>

						<View style={styles.popupBody}>
							<Text style={styles.fieldLabel}>{label}</Text>

							{/* 시간 선택 */}
							<TouchableOpacity
								style={styles.timeEdit}
								onPress={() => setPickerOpen(true)}
								activeOpacity={0.8}
							>
								<Ionicons name="time" size={18} color="#fff" />
								<Text style={styles.timeEditText}> {formatTime(draftTime).replace(':', ' : ')} </Text>
								<Ionicons name="chevron-down" size={16} color="#fff" />
							</TouchableOpacity>

							{/* 숫자 입력 */}
							<View style={styles.inputRow}>
								<TextInput
									style={styles.input}
									value={draftGlucose}
									onChangeText={setDraftGlucose}
									keyboardType="number-pad"
									placeholder="000"
									maxLength={3}
								/>
								<Text style={styles.inputUnit}>mg/dL</Text>
                            </View>
						</View>

						<TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.9}>
							<Text style={styles.saveBtnText}>기록</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			{/* 시간 피커(모달) */}
			<DatePicker
				modal
				open={pickerOpen}
				date={draftTime}
				mode="time"
				locale="ko"
				androidVariant="iosClone"
				title="시간 선택"
				confirmText="확인"
				cancelText="취소"
				onConfirm={(d) => {
					setDraftTime(d);
					setPickerOpen(false);
				}}
				onCancel={() => setPickerOpen(false)}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 16,
		marginVertical: 10,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	label: {
		fontSize: 16,
		color: '#111',
		fontFamily: MAIN_FONT,
	},
	timeBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#8b93ff',
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 12,
	},
	timeText: {
		color: '#fff',
		fontFamily: MAIN_FONT,
	},
	valueBox: {
		alignItems: 'center',
		paddingVertical: 8,
	},
	valueText: {
		fontSize: 48,
		color: '#111',
		lineHeight: 60,
		fontFamily: MAIN_FONT,
	},
	unitText: {
		alignSelf: 'flex-end',
		color: '#555',
		fontFamily: MAIN_FONT,
		fontSize: 12,
	},
	backdrop: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.35)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},
	popup: {
		width: '100%',
		backgroundColor: '#eaf2ff',
		borderRadius: 18,
		overflow: 'hidden',
	},
	popupHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 18,
		paddingVertical: 14,
	},
	popupTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
	popupBody: {
		backgroundColor: '#fff',
		marginHorizontal: 14,
		borderRadius: 14,
		padding: 14,
		marginBottom: 14,
	},
	fieldLabel: { fontSize: 15, color: '#111', marginBottom: 10, fontFamily: MAIN_FONT },
	timeEdit: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'flex-start',
		backgroundColor: '#8b93ff',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 12,
		marginBottom: 12,
	},
	timeEditText: {
		color: '#fff',
		fontFamily: MAIN_FONT,
	},
	inputRow: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'center',
	},
	input: {
		flex: 0,
		minWidth: 100,
		textAlign: 'center',
		fontSize: 40,
		color: '#111',
		paddingVertical: 4,
		borderBottomWidth: 1,
		borderColor: '#ddd',
		fontFamily: MAIN_FONT,
	},
	inputUnit: { marginLeft: 8, color: '#555', fontFamily: MAIN_FONT, },
	saveBtn: {
		backgroundColor: '#8b93ff',
		margin: 14,
		borderRadius: 14,
		alignItems: 'center',
		paddingVertical: 14,
	},
	saveBtnText: { color: '#fff', fontSize: 18, fontFamily: MAIN_FONT, },
});

export default BloodEntryCard;
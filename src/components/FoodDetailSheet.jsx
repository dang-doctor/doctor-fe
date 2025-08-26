import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const FoodDetailSheet = ({ visible, onClose, item, stylesTheme }) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const sheetHeight = useMemo(() => Math.min(520, SCREEN_HEIGHT * 0.78), []);

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  const pan = useRef(new Animated.Value(0)).current;
  const threshold = 120;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
      onPanResponderMove: Animated.event([null, { dy: pan }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, g) => {
        if (g.dy > threshold) {
          onClose?.();
          pan.setValue(0);
        } else {
          Animated.spring(pan, { toValue: 0, useNativeDriver: false }).start();
        }
      },
    }),
  ).current;

  const containerStyle = {
    transform: [{ translateY }, { translateY: pan }],
  };

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={s.backdrop}>
        <Pressable style={s.backdropTouch} onPress={onClose} />
        <Animated.View
          style={[
            s.sheet,
            { paddingBottom: insets.bottom + 12, height: sheetHeight },
            containerStyle,
          ]}
          {...panResponder.panHandlers}
        >
          <View style={s.handleWrap}>
            <View style={s.handle} />
          </View>
          <Text style={[s.title, stylesTheme?.title]}>{item?.name}</Text>
          <View style={s.metricCard}>
            <View style={s.metricRow}>
              <View style={s.metricPill}>
                <Text style={s.metricPillLabel}>GI</Text>
                <Text style={s.metricPillValue}>
                  {' '}
                  {Number(item?.gi_index ?? 0)}
                </Text>
              </View>
              <View style={s.metricPill}>
                <Text style={s.metricPillLabel}>당</Text>
                <Text style={s.metricPillValue}>
                  {' '}
                  {Number(item?.sugar_content ?? 0)}g
                </Text>
              </View>
            </View>
            <View style={s.calorieRow}>
              <Text style={s.calorieValue}>{Number(item?.calories ?? 0)}</Text>
              <Text style={s.calorieUnit}>kcal</Text>
            </View>
          </View>
          <View style={s.descCard}>
            <Text style={s.descText}>{item?.description}</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  backdropTouch: { ...StyleSheet.absoluteFillObject },
  sheet: {
    backgroundColor: '#f4f7ff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
  },
  handleWrap: { alignItems: 'center', paddingTop: 10, paddingBottom: 6 },
  handle: { width: 64, height: 6, borderRadius: 3, backgroundColor: '#c9cfdd' },
  title: {
    fontSize: 30,
    color: '#0f172a',
    marginTop: 12,
    marginBottom: 18,
    fontFamily: 'ONE Mobile POP OTF',
  },
  metricCard: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderRadius: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fde7ee',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  metricPillLabel: {
    fontSize: 16,
    color: '#f43f5e',
    fontFamily: 'ONE Mobile POP OTF',
  },
  metricPillValue: {
    fontSize: 18,
    color: '#1f2937',
    fontFamily: 'ONE Mobile POP OTF',
  },
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    paddingTop: 4,
  },
  calorieValue: {
    fontSize: 48,
    color: '#0f172a',
    fontFamily: 'ONE Mobile POP OTF',
  },
  calorieUnit: {
    fontSize: 22,
    color: '#374151',
    fontFamily: 'ONE Mobile POP OTF',
  },
  descCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 10,
  },
  descText: {
    fontSize: 17,
    color: '#111827',
    lineHeight: 27,
    fontFamily: 'ONE Mobile POP OTF',
  },
});

export default FoodDetailSheet;

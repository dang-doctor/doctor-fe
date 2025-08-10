import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, PermissionsAndroid, Platform, Pressable, StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

const CameraScreen = ({ navigation, onClose, onShot }) => {
  const insets = useSafeAreaInsets();
  const device = useCameraDevice('back');
  const cameraRef = useRef(null);

  const [granted, setGranted] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const res = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        setGranted(res === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        const status = await Camera.requestCameraPermission();
        setGranted(status === 'granted');
      }
    })();
  }, []);

  useEffect(() => {
    if (device?.formats?.length) {
      const { height: screenH, width: screenW } = Dimensions.get('window');
      const screenRatio = screenH / screenW;
  
      const format = device.formats.reduce((prev, curr) =>
        curr.videoHeight * curr.videoWidth > prev.videoHeight * prev.videoWidth ? curr : prev
      );
      const camRatio = format.videoHeight / format.videoWidth;
  
      const baseScale =
        camRatio > screenRatio
          ? camRatio / screenRatio
          : screenRatio / camRatio;
  
      setScale(baseScale);
    }
  }, [device]);

  const handleClose = useMemo(
    () => () => {
      if (onClose) onClose();
      else if (navigation && navigation.goBack) navigation.goBack();
    },
    [navigation, onClose]
  );

  const handleShutter = async () => {
    try {
      if (!cameraRef.current) return;
      const photo = await cameraRef.current.takePhoto({
        // 필요 시 옵션: flash: 'off' | 'on' | 'auto'
        // qualityPrioritization: 'quality' | 'balanced' | 'speed'
      });
      console.log('PHOTO:', photo); // { path, width, height, ... }
      if (onShot) onShot(photo);
    } catch (e) {
      console.warn('takePhoto error', e);
    }
  };

  if (!granted || !device) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={[StyleSheet.absoluteFill, { transform: [{ scale }] }]}
        device={device}
        isActive={true}
        photo={true}
        video={false}
      />

      {/* 상단 우측 X 버튼 */}
      <Pressable
        onPress={handleClose}
        style={[
          styles.closeBtn,
          { top: Math.max(insets.top, 8) + 8, right: 12 },
        ]}
        android_ripple={{ borderless: true }}
      >
        <Text style={styles.closeTxt}>✕</Text>
      </Pressable>

      {/* 하단 중앙 셔터 버튼 */}
      <View style={[styles.shutterWrap, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <Pressable onPress={handleShutter} style={styles.shutterOuter} android_ripple={{ borderless: true }}>
          <View style={styles.shutterInner} />
        </Pressable>
      </View>
    </View>
  );
};

const BTN_SIZE = 72;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Close (X)
  closeBtn: {
    position: 'absolute',
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  closeTxt: { color: '#fff', fontSize: 20, fontWeight: '600' },

  // Shutter
  shutterWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  shutterOuter: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE / 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: BTN_SIZE - 16,
    height: BTN_SIZE - 16,
    borderRadius: (BTN_SIZE - 16) / 2,
    backgroundColor: '#e74c3c',
  },
});

export default CameraScreen;
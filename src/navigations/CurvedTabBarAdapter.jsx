// src/navigations/CurvedTabBarAdapter.jsx
import React, { useMemo } from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import CurvedTabBar from './CurvedTabBar';
import TABS_CONST from '../constants/curveTabs';

// 라우트 이름 매핑: 어떤 탭의 어떤 내부 화면에서 탭바를 숨길지
const HIDE_MAP = {
	main: new Set(['CameraScreen',]), // 메인 탭 내부의 카메라 계열 화면에서 숨김
	// blood: new Set(['SomeFullScreen']),
	// menu: new Set([]),
	// chart: new Set([]),
};

const CurvedTabBarAdapter = ({ state, navigation, descriptors }) => {
	const { routes, index } = state;
	const parentRoute = routes[index];          // ex) 'main' 탭
	const activeTabKey = parentRoute.name;      // 'main' | 'blood' | 'menu' | 'chart'

	// 하위(Stack)에서 현재 포커스된 스크린 이름
	const focusedChild =
		getFocusedRouteNameFromRoute(parentRoute) ??
		parentRoute.state?.routes?.[parentRoute.state.index || 0]?.name ??
		null;

	// 숨김 조건: 탭 이름 + 하위 포커스 스크린 이름으로 판단
	if (focusedChild && HIDE_MAP[activeTabKey]?.has(focusedChild)) {
		return null; // ← 여기서 탭바 자체를 안 그리므로 화면에서 사라짐
	}

	// 평소 렌더
	const iconMap = useMemo(() => {
		const m = new Map();
		TABS_CONST.forEach(t => m.set(t.key, t.icon));
		return m;
	}, []);
	const tabs = routes.map(r => ({ key: r.name, icon: iconMap.get(r.name) || 'ellipse-outline' }));

	const handleTabPress = (key) => {
		if (key !== activeTabKey) navigation.navigate(key);
	};

	return (
		<CurvedTabBar
			activeKey={activeTabKey}
			onTabPress={handleTabPress}
			tabs={tabs}
		/>
	);
};

export default CurvedTabBarAdapter;

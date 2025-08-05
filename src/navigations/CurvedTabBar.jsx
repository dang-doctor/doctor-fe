import React, { useEffect, useRef, useState } from 'react';
import TABS from '../constants/curveTabs.js';
import { Dimensions, StyleSheet, TouchableOpacity, View, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get("window");
const tabHeight = 68;
const floatingBtnSize = 45;
const curveWidth = floatingBtnSize * 2.0;
const curveHeight = floatingBtnSize * 0.8;
const sidePadding = 24;

const getCurvePath = (centerX) => {
    const left = centerX - curveWidth / 2;
    const right = centerX + curveWidth / 2;
    return `
        M0 0
        H${left}
        C${left + curveWidth * 0.15} 0, ${centerX - curveWidth * 0.27} ${curveHeight}, ${centerX} ${curveHeight}
        C${centerX + curveWidth * 0.27} ${curveHeight}, ${right - curveWidth * 0.15} 0, ${right} 0
        H${width}
        V${tabHeight}
        H0
        Z
    `;
}

const CurvedTabBar = ({ activeKey, onTabPress }) => {
    const activeIdx = TABS.findIndex(tab => tab.key === activeKey);
    const tabCount = TABS.length;
    const tabAreaWidth = width - sidePadding * 2;
    const tabWidth = tabAreaWidth / tabCount;

    const initialCurveCenterX = sidePadding + tabWidth * activeIdx + tabWidth / 2;
    const curveCenterX = useRef(new Animated.Value(initialCurveCenterX)).current;

    const [curvePath, setCurvePath] = useState(getCurvePath(initialCurveCenterX));

    // btn animation
    const FLOAT_HEIGHT = 30;
    const floatingAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const targetCenterX = sidePadding + tabWidth * activeIdx + tabWidth / 2;

        // tab curve
        Animated.timing(curveCenterX, {
            toValue: targetCenterX,
            duration: 280,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();

        //btn
        floatingAnim.setValue(0); // 초기화
        Animated.spring(floatingAnim, {
            toValue: 1,
            friction: 6,
            useNativeDriver: true,
        }).start();
    }, [activeKey, tabWidth]);

    const translateY = floatingAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [FLOAT_HEIGHT, 0],
    });

    useEffect(() => {
        const id = curveCenterX.addListener(({ value }) => {
            setCurvePath(getCurvePath(value));
        });
        setCurvePath(getCurvePath((curveCenterX)._value || initialCurveCenterX));
        return () => curveCenterX.removeListener(id);
    }, []);

    return (
        <View style={styles.root}>
            {/* NavBar Background */}
            <View style={styles.navBarBg}>
                <Svg width={width} height={tabHeight} style={{ position: "absolute", bottom: 0 }}>
                    <Path fill="#fff" d={curvePath} />
                </Svg>
            </View>
            {/* Btn Container */}
            <View style={[styles.btnContainer, { width: tabAreaWidth, left: sidePadding }]}>
                {TABS.map((tab, i) => {
                    const focused = tab.key === activeKey;
                    const x = tabWidth * i + tabWidth / 2 - floatingBtnSize / 2;
                    if (focused) {
                        return (
                            <Animated.View
                                key={tab.key}
                                style={[
                                    styles.floatingBtn,
                                    {
                                        left: x,
                                        bottom: tabHeight - curveHeight - floatingBtnSize / 2 + 30,
                                        transform: [{translateY}],
                                    }
                                ]}
                            >
                                <TouchableOpacity
                                    style={styles.fab}
                                    onPress={() => onTabPress(tab.key)}
                                    activeOpacity={0.85}
                                >
                                    <Ionicons name={tab.icon} size={30} color="#929EFF" />
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    }
                    return (
                        <TouchableOpacity
                            key={tab.key}
                            style={[
                                styles.flatBtn,
                                {
                                    left: x,
                                    bottom: 10,
                                }
                            ]}
                            onPress={() => onTabPress(tab.key)}
                            activeOpacity={0.8}
                        >
                            <Ionicons name={tab.icon} size={26} color="#888" />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: tabHeight + 36,
        width: "100%",
        zIndex: 10,
        pointerEvents: "box-none",
    },
    navBarBg: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: tabHeight,
        width: "100%",
        backgroundColor: "transparent",
        zIndex: 1,
        overflow: "visible",
        pointerEvents: "none",
    },
    btnContainer: {
        position: "absolute",
        left: sidePadding,
        bottom: 0,
        height: tabHeight + 32,
        marginBottom: 10,
        flexDirection: "row",
        zIndex: 2,
        pointerEvents: "box-none",
    },
    floatingBtn: {
        position: "absolute",
        width: floatingBtnSize,
        height: floatingBtnSize,
        borderRadius: floatingBtnSize / 2,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "transparent",
        elevation: 0,
        zIndex: 3,
        overflow: "visible",
    },
    fab: {
        width: floatingBtnSize,
        height: floatingBtnSize,
        borderRadius: floatingBtnSize / 2,
        alignItems: "center",
        justifyContent: "center",
    },
    flatBtn: {
        position: "absolute",
        width: floatingBtnSize,
        height: floatingBtnSize,
        borderRadius: floatingBtnSize / 2,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
        overflow: "visible",
    },
});

export default CurvedTabBar;
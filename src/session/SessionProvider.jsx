// session/SessionProvider.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SessionContext = createContext(null);
const STORAGE_KEY = 'session_user';	// ✅ 기존 키 유지

// 세션 구조 예시(기존 명칭 유지)
// {
// 	id: 'abc',
// 	nickname: '준',
// 	idToken: '...',              // ✅ 복구
// 	firebase_token: '...',       // 기존 그대로 유지
// 	accessToken: '...',          // (있다면 그대로 사용)
// 	prefs: { gender, height, weight, activity, macros: { carb, protein, fat } },
// 	updatedAt: 0
// }

export const SessionProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isReady, setIsReady] = useState(false);
	const [loading, setLoading] = useState(false);

	// 초기 로드(기존 키 사용)
	useEffect(() => {
		(async () => {
			try {
				const raw = await AsyncStorage.getItem(STORAGE_KEY);
				if (raw) setUser(JSON.parse(raw));
			} catch (e) {
				console.warn('[Session] load error:', e?.message);
			} finally {
				setIsReady(true);
			}
		})();
	}, []);

	const persist = async (next) => {
		try {
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
		} catch (e) {
			console.warn('[Session] persist error:', e?.message);
		}
	};

	// ✅ 기존 설계/이름 존중: login / logout / updateToken / updateUser / saveUserPrefs 유지
	const login = async (userData = {}) => {
		setLoading(true);
		try {
			const next = { ...userData, updatedAt: Date.now() };
			setUser(next);
			await persist(next);
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		setLoading(true);
		try {
			setUser(null);
			await AsyncStorage.removeItem(STORAGE_KEY);
		} finally {
			setLoading(false);
		}
	};

	// ✅ 토큰 갱신: idToken 포함(이름 변경 없음)
	const updateToken = async ({ idToken, firebase_token, accessToken }) => {
		setUser((prev) => {
			const next = {
				...(prev || {}),
				...(idToken ? { idToken } : {}),
				...(firebase_token ? { firebase_token } : {}),
				...(accessToken ? { accessToken } : {}),
				updatedAt: Date.now(),
			};
			persist(next);
			return next;
		});
	};

	// ✅ 유저 필드 부분 업데이트(닉네임 등)
	const updateUser = async (patch = {}) => {
		setUser((prev) => {
			const next = { ...(prev || {}), ...patch, updatedAt: Date.now() };
			persist(next);
			return next;
		});
	};

	// ✅ 화면 입력값 저장 (prefs merge) — 이름 유지
	const saveUserPrefs = async (prefsPatch = {}) => {
		setUser((prev) => {
			const next = {
				...(prev || {}),
				prefs: { ...((prev && prev.prefs) || {}), ...prefsPatch },
				updatedAt: Date.now(),
			};
			persist(next);
			return next;
		});
	};

	// ✅ API 헤더 헬퍼: 우선순위 (firebase_token → idToken → accessToken)
	const getAuthHeaders = useMemo(() => {
		return () => {
			const token = user?.firebase_token || user?.idToken || user?.accessToken;
			return token ? { Authorization: token } : {};
		};
	}, [user?.firebase_token, user?.idToken, user?.accessToken]);

	const value = useMemo(
		() => ({
			user,
			isReady,
			loading,
			login,
			logout,
			updateToken,
			updateUser,
			saveUserPrefs,
			getAuthHeaders,
		}),
		[user, isReady, loading, getAuthHeaders]
	);

	return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => useContext(SessionContext);
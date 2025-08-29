import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getIdTokenFromServer } from './apiFetch';

const SessionContext = createContext(null);
const STORAGE_KEY = 'DD_SESSION_v1';


const SessionProvider = ({ children }) => {
	const [token, setToken] = useState(null);
	const [user, setUser] = useState(null);
	const [idToken, setIdToken] = useState(null);
	const [isReady, setIsReady] = useState(false);

	const hydrate = async () => {
		try {
			const raw = await AsyncStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				setToken(parsed?.token ?? null);
				setUser(parsed?.user ?? null);
				
				// idToken이 있다면 설정
				if (parsed?.idToken) {
					setIdToken(parsed.idToken);
				}
			}
		} catch (e) {
			console.log(`Error at hydrate(function) in SsessionProvider.jsx :\n${e}`);
		} finally {
			setIsReady(true);
		}
	}

	useEffect(() => {
		hydrate();
	},[]);

	const login = async ({ token: t, user: u }) => {
		setToken(t || null);
		setUser(u || null);
		
		// user가 있고 kakao_id가 있다면 idToken을 가져옴
		if (u?.kakao_id) {
			try {
				const newIdToken = await getIdTokenFromServer(u.kakao_id);
				setIdToken(newIdToken);
				await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ 
					token: t || null, 
					user: u || null,
					idToken: newIdToken 
				}));
			} catch (e) {
				console.log(`Error getting ID token in login: ${e}`);
				await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ 
					token: t || null, 
					user: u || null 
				}));
			}
		} else {
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ 
				token: t || null, 
				user: u || null 
			}));
		}
	}

	const logout = async () => {
		setToken(null);
		setUser(null);
		setIdToken(null);
		try {
			await AsyncStorage.removeItem(STORAGE_KEY);
		} catch (e) {
			console.log(`Error at logout(function) in SessionProvider.jsx :\n${e}`)
		}
	}

	const value = useMemo(() => ({
		isReady,
		token,
		user,
		idToken,
		login,
		logout,
	}), [isReady, token, user, idToken]);
	
	return (
		<SessionContext.Provider value={value}>
			{children}
		</SessionContext.Provider>
	);
};

const useSession = () => useContext(SessionContext);

export { SessionProvider, useSession };
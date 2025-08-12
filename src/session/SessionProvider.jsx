import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const SessionContext = createContext(null);
const STORAGE_KEY = 'DD_SESSION_v1';


const SessionProvider = ({ children }) => {
	const [token, setToken] = useState(null);
	const [user, setUser] = useState(null);
	const [isReady, setIsReady] = useState(false);

	const hydrate = async () => {
		try {
			const raw = await AsyncStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				setToken(parsed?.token ?? null);
				setUser(parsed?.user ?? null);
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
		try {
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ token: t || null, user: u || null}));
		} catch (e) {
			console.log(`Error at login(function) in SessionProvider.jsx :\n${e}`);
		}
	}

	const logout = async () => {
		setToken(null);
		setUser(null);
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
		login,
		logout,
	}), [isReady, token, user]);
	
	return (
		<SessionContext.Provider value={value}>
			{children}
		</SessionContext.Provider>
	);
};

const useSession = () => useContext(SessionContext);

export { SessionProvider, useSession };
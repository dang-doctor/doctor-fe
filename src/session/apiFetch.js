import { auth } from './firebaseConfig';
import { signInWithCustomToken } from 'firebase/auth';
import Config from 'react-native-config';

export async function apiFetch(url, init = {}) {
  try {
    const idToken = await auth.currentUser?.getIdToken(true);
    const headers = new Headers(init.headers || {});
    
    if (idToken) {
      headers.set('Authorization', `Bearer ${idToken}`);
      console.log('🔐 Token added to request:', idToken.substring(0, 20) + '...');
    } else {
      console.log('⚠️ No ID token available');
    }
    
    return fetch(url, { ...init, headers });
  } catch (error) {
    console.error('❌ apiFetch error:', error);
    throw error;
  }
}

export async function getIdTokenFromServer(kakaoId) {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/auth/firebase/refresh-token/${kakaoId}`);
    const { firebase_token } = await response.json();
    
    await signInWithCustomToken(auth, firebase_token);
    const idToken = await auth.currentUser.getIdToken(true);
    
    console.log('✅ ID token obtained:', idToken.substring(0, 20) + '...');
    return idToken;
  } catch (error) {
    console.error('❌ Failed to get ID token:', error);
    throw error;
  }
}


import api from '../api/apiClient';
import { AUTH_GOOGLE, AUTH_LOGOUT } from '../api/endpoints';
import { secureStorage } from '../storage/secureStorage';
import { performGoogleSignIn, performGoogleSignOut } from './googleSignIn';

/**
 * Login with Google: get idToken from Google Sign-In, send to backend, store token and user.
 * Backend: POST /api/auth/android/google, X-Package-ID: com.gumbo.english
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function loginWithGoogle() {
  const { idToken } = await performGoogleSignIn();

  console.log('[authService] Sending idToken to backend', AUTH_GOOGLE);
  const res = await api.post(AUTH_GOOGLE, { idToken });
  const data = res?.data;
  const payload = data?.data ?? data;

  if (!data?.success && !payload?.token) {
    const msg = data?.message || data?.error || payload?.message || 'Login failed';
    console.error('[authService] Backend login failed', { status: res?.status, data, message: msg });
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
  console.log('[authService] Backend login success', { userId: payload?.user?.id ?? payload?.user?._id });

  const token = payload?.token ?? data?.token;
  const backendUser = payload?.user ?? data?.user ?? {};
  const subscription = payload?.subscription ?? data?.subscription;
  const userId = backendUser?.id ?? backendUser?._id ?? '';
  const name =
    backendUser?.name ??
    backendUser?.fullName ??
    (([backendUser?.firstName, backendUser?.lastName].filter(Boolean).join(' ') || 'User'));
  const email = backendUser?.email ?? '';

  const userData = {
    id: userId,
    name,
    email,
    token,
    userName: name,
    phoneNumber: backendUser?.phoneNumber ?? backendUser?.number ?? '',
    age: backendUser?.age ?? backendUser?.parentAge ?? '',
    profileImageUri: backendUser?.profilePhoto ?? backendUser?.profilePhotoUrl ?? null,
    isOnboardingComplete: !!backendUser?.isOnboardingComplete,
    isSubscribed: !!subscription?.active,
  };

  console.log('[authService] token', token);
  await secureStorage.setAccessToken(token);
  await secureStorage.setUserData(userData);
  console.log('[authService] Token and user stored in secure storage for future API calls (Bearer sent by apiClient)');

  return { user: userData, token };
}

/**
 * Logout: call backend POST /api/auth/android/logout (Bearer + X-Package-ID), then sign out from Google and clear local storage.
 * Backend: Private; no body. Client discards token after this.
 */
export async function logout() {
  console.log('[authService] Logout: calling backend', AUTH_LOGOUT);
  try {
    await api.post(AUTH_LOGOUT);
    console.log('[authService] Backend logout success');
  } catch (e) {
    console.log('[authService] Backend logout failed (will clear local anyway)', e?.message ?? e);
  }
  await performGoogleSignOut();
  await secureStorage.clearAll();
  console.log('[authService] Local token and user data cleared');
}

/**
 * Hydrate auth state from storage (e.g. on app launch).
 */
export async function getStoredAuth() {
  const [user, token] = await Promise.all([
    secureStorage.getUserData(),
    secureStorage.getAccessToken(),
  ]);
  console.log('[authService] getStoredAuth:', token ? 'token present (will be used by apiClient)' : 'no token');
  return { user, token };
}

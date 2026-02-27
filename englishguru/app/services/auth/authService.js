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
    ([backendUser?.firstName, backendUser?.lastName].filter(Boolean).join(' ') || 'User');
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

  await secureStorage.setAccessToken(token);
  await secureStorage.setUserData(userData);

  return { user: userData, token };
}

/**
 * Logout: call backend logout, sign out from Google, clear local storage.
 */
export async function logout() {
  try {
    await api.post(AUTH_LOGOUT, {});
  } catch (e) {}
  await performGoogleSignOut();
  await secureStorage.clearAll();
}

/**
 * Hydrate auth state from storage (e.g. on app launch).
 */
export async function getStoredAuth() {
  const [user, token] = await Promise.all([
    secureStorage.getUserData(),
    secureStorage.getAccessToken(),
  ]);
  return { user, token };
}

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import { config } from '../../config/env';

/**
 * Configure Google Sign-In (call once at app start and again before sign-in).
 */
export function configureGoogleSignIn() {
  const webClientId = config.google?.webClientId;
  if (!webClientId) return;
  GoogleSignin.configure({
    webClientId,
    offlineAccess: true,
  });
}

/**
 * Perform Google Sign-In and return the ID token for backend auth.
 * Opens the "Select your account" picker like Jeevansathi.
 * @returns {Promise<{ idToken: string, user: { email, displayName } }>}
 */
export async function performGoogleSignIn() {
  const webClientId = config.google?.webClientId;
  if (!webClientId) {
    throw new Error('Google Sign-In is not configured. Add WEB_CLIENT_ID to .env');
  }
  GoogleSignin.configure({
    webClientId,
    offlineAccess: true,
  });

  if (Platform.OS === 'android') {
    await new Promise((r) => setTimeout(r, 300));
  }

  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  console.log('[googleSignIn] Opening account picker, webClientId:', config.google?.webClientId ? '***set***' : 'MISSING');
  let signInResult;
  try {
    signInResult = await GoogleSignin.signIn();
    console.log('[googleSignIn] signIn result:', signInResult ? 'got result' : 'null (cancelled)');
  } catch (nativeError) {
    console.error('[googleSignIn] Native sign-in error:', nativeError?.code, nativeError?.message);
    const code = nativeError?.code || nativeError?.error?.code;
    const msg = nativeError?.message || nativeError?.error?.message || '';
    if (code === 'sign_in_cancelled' || code === 'SIGN_IN_CANCELLED' || msg.includes('cancelled')) {
      throw new Error('Sign in was cancelled');
    }
    if (code === 'DEVELOPER_ERROR' || msg.includes('developer')) {
      throw new Error(
        'Add your app SHA-1 in Firebase Console. ' +
        'Terminal: keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android ' +
        'Then Firebase → Project settings → Android app com.gumbo.english → Add fingerprint (SHA-1).'
      );
    }
    throw new Error(msg || 'Google Sign-In failed');
  }

  if (signInResult === null || signInResult === undefined) {
    throw new Error('Sign in was cancelled');
  }
  if (signInResult?.code === 'sign_in_cancelled' || signInResult?.code === 'SIGN_IN_CANCELLED') {
    throw new Error('Sign in was cancelled');
  }

  let idToken =
    signInResult?.data?.idToken ?? (signInResult && signInResult.idToken);
  if (!idToken) {
    try {
      const tokens = await GoogleSignin.getTokens();
      idToken = tokens?.idToken;
    } catch (e) {
      // ignore
    }
  }
  if (!idToken) {
    console.error('[googleSignIn] No idToken in result');
    throw new Error('No ID token from Google. Check WEB_CLIENT_ID in Firebase Console.');
  }

  const user = signInResult?.data?.user ?? signInResult?.user ?? {};
  console.log('[googleSignIn] Got idToken, email:', user?.email ?? 'n/a');
  return {
    idToken,
    user: {
      email: user.email ?? null,
      displayName: user.name ?? user.displayName ?? null,
    },
  };
}

/**
 * Sign out from Google (e.g. on logout).
 */
export async function performGoogleSignOut() {
  try {
    await GoogleSignin.signOut();
  } catch (e) {}
}

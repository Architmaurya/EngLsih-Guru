import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { useUser } from '../../../context/UserContext';
import { loginWithGoogle } from '../../../services/auth/authService';
import { configureGoogleSignIn } from '../../../services/auth/googleSignIn';
import { logoShadow } from './HomeScreen.styles';
import { loginSucceeded } from '../../../store/authSlice';

export default function HomeScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const handleGooglePress = async () => {
    setLoading(true);
    try {
      const { user: userData, token } = await loginWithGoogle();
      setUser({
        id: userData.id,
        userName: userData.userName || userData.name,
        phoneNumber: userData.phoneNumber || '',
        age: userData.age || '',
        profileImageUri: userData.profileImageUri,
        email: userData.email,
        token,
        isOnboardingComplete: userData.isOnboardingComplete,
        isSubscribed: userData.isSubscribed,
      });
      dispatch(
        loginSucceeded({
          user: {
            ...userData,
            isOnboardingComplete: userData.isOnboardingComplete,
          },
          token,
        }),
      );
    } catch (err) {
      const message = err?.message || 'Sign in failed. Please try again.';
      console.error('[HomeScreen] Google sign-in error:', message, err);
      if (message !== 'Sign in was cancelled') {
        Alert.alert('Sign in failed', message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#FFF5F6', '#FEE2E7']}
      style={{ flex: 1 }}
    >
      <View className="flex-1 pt-8">
        <View className="flex-1 items-center justify-center px-4">
        <View className="mb-5 h-32 w-32 items-center justify-center rounded-full bg-[#FFEAF8]" style={logoShadow} />

        <Text className="mt-3 font-openSans text-heading font-bold text-[#9A1A8F]">
          English Guru
        </Text>

        <Text className="mt-3 font-hindi text-heading font-semibold text-gray-900">
          नमस्ते!
        </Text>

        <Text className="mt-2 px-8 text-center font-hindi text-heading text-gray-600">
          अब इंग्लिश सीखना हुआ आसान।
        </Text>

        <View className="my-6 h-44 w-44" />

        <Text className="mt-2 px-10 text-center font-hindi text-body text-gray-700">
          भारत की महिलाओं के लिए ख़ास बनाया गया।
        </Text>

        <TouchableOpacity
          onPress={handleGooglePress}
          disabled={loading}
          activeOpacity={0.8}
          className="mt-10 h-14 w-[90%] flex-row items-center justify-center gap-3 rounded-xl bg-white shadow-md"
        >
          {loading ? (
            <ActivityIndicator size="small" color="#9A1A8F" />
          ) : (
            <>
              <Text className="font-openSans text-body font-bold text-black">
                Continue with Google
              </Text>
            </>
          )}
        </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

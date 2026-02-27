import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { useUser } from '../../../context/UserContext';
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton';
import { markOnboardingComplete } from '../../../store/authSlice';
import { secureStorage } from '../../../services/storage/secureStorage';
import { completeOnboarding } from '../../../services/onboarding/onboardingService';

const TOP_PADDING = Platform.OS === 'android' ? 0 : 44;

// 10-digit Indian mobile (6/7/8/9)
const mobileDigits = (s) => (s || '').replace(/\D/g, '').slice(0, 10);
const isValidNumber = (s) => /^[6-9]\d{9}$/.test(mobileDigits(s));
const toNumber = (s) => mobileDigits(s);

export default function FillInfoScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { user, updateUser } = useUser();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [age, setAge] = useState('');
  const [studentClass, setStudentClass] = useState('');

  const isNameFilled = name.trim().length > 0;
  const isMobileFilled = isValidNumber(mobile);
  const ageNum = parseInt(age.trim(), 10);
  const isAgeFilled = Number.isInteger(ageNum) && ageNum >= 18 && ageNum <= 80;
  const classNum = parseInt(studentClass.trim(), 10);
  const isClassFilled = Number.isInteger(classNum) && classNum >= 1 && classNum <= 9;
  const canSubmit = isNameFilled && isMobileFilled && isAgeFilled && isClassFilled;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: TOP_PADDING }}>
      <View className="flex-1">
      <View className="items-center mt-6 px-4 py-3">
        <Text className="font-hindi text-heading font-bold text-gray-900">
          अपनी जानकारी भरें
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6 mt-5">
          <Text className="mb-2 font-hindi text-body font-bold text-black">
            नाम <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 font-hindi text-body text-gray-900"
            placeholder="अपना नाम लिखें"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="mb-6">
          <Text className="mb-2 font-hindi text-body font-bold text-black">
            मोबाइल नंबर <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 font-hindi text-body text-gray-900"
            placeholder="अपना मोबाइल नंबर लिखें"
            placeholderTextColor="#9CA3AF"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
          />
        </View>

        <View className="mb-6">
          <Text className="mb-2 font-hindi text-body font-bold text-black">
            कक्षा (1–9) <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 font-hindi text-body text-gray-900"
            placeholder="कक्षा चुनें (1 से 9)"
            placeholderTextColor="#9CA3AF"
            value={studentClass}
            onChangeText={setStudentClass}
            keyboardType="number-pad"
            maxLength={1}
          />
        </View>

        <View className="mb-6">
          <Text className="mb-2 font-hindi text-body font-bold text-black">
            अभिभावक की उम्र (18–80) <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 font-hindi text-body text-gray-900"
            placeholder="उम्र लिखें"
            placeholderTextColor="#9CA3AF"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
          />
        </View>

        <PrimaryButton
          onPress={
            canSubmit
              ? async () => {
                  try {
                    const payload = {
                      name: name.trim(),
                      number: toNumber(mobile),
                      class: classNum,
                      parentAge: ageNum,
                    };
                    const data = await completeOnboarding(payload);
                    const updatedUser = {
                      ...(user || {}),
                      userName: data?.name ?? name.trim(),
                      phoneNumber: data?.number ?? mobile,
                      age: String(data?.parentAge ?? ageNum),
                      class: data?.class ?? classNum,
                      parentAge: data?.parentAge ?? ageNum,
                      isOnboardingComplete: data?.isOnboardingComplete ?? true,
                    };
                    updateUser(updatedUser);
                    await secureStorage.setUserData(updatedUser);
                    dispatch(markOnboardingComplete(updatedUser));
                  } catch (err) {
                    console.error('[FillInfoScreen] Onboarding failed', err?.message ?? err);
                  }
                }
              : undefined
          }
          className={canSubmit ? '' : 'opacity-40'}
          label="जारी रखें (Continue)"
        />
      </ScrollView>

      <View
        className="flex-row items-center justify-center gap-2 bg-white px-4 py-3"
        style={{ paddingBottom: 12 + insets.bottom }}
      >
        <Text className="text-rest text-gray-500">ℹ</Text>
        <Text className="font-hindi text-rest text-gray-500">
          चिंता न करें, आप बाद में भी बदल सकती हैं
        </Text>
      </View>
      </View>
    </View>
  );
}

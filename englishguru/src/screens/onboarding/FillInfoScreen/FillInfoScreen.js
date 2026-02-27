import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useUser } from '../../../context/UserContext';
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton';
import { markOnboardingComplete } from '../../../store/authSlice';
import { secureStorage } from '../../../services/storage/secureStorage';

const TOP_PADDING = Platform.OS === 'android' ? 0 : 44;

export default function FillInfoScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user, updateUser } = useUser();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [age, setAge] = useState('');

  const isNameFilled = name.trim().length > 0;
  const isMobileFilled = mobile.trim().length > 0;
  const isAgeFilled = age.trim().length > 0;
  const canSubmit = isNameFilled && isMobileFilled && isAgeFilled;

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
            उम्र <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 font-hindi text-body text-gray-900"
            placeholder="अपनी उम्र लिखें"
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
            const updatedUser = {
              ...(user || {}),
              userName: name?.trim() || 'आरती',
              phoneNumber: mobile?.trim() || '+91 98765 43210',
              age: age?.trim() || '',
              isOnboardingComplete: true,
            };
            updateUser(updatedUser);
            await secureStorage.setUserData(updatedUser);
            dispatch(markOnboardingComplete());
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

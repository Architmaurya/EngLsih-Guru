import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import PrimaryButton from '../components/PrimaryButton';

const TOP_PADDING = Platform.OS === 'android' ? 0 : 44;

export default function FillInfoScreen() {
  const navigation = useNavigation();
  const { updateUser } = useUser();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [age, setAge] = useState('');
  const [hasChildren, setHasChildren] = useState(true);
  const [wantsToTeach, setWantsToTeach] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: TOP_PADDING }}>
      <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center align-center justify-between mt-6 px-4 py-3">
        <Pressable
          onPress={() => navigation.goBack()}
          className="h-10 w-10 items-center justify-center active:opacity-70"
        >
          <Ionicons name="chevron-back" size={28} color="#1f2937" />
        </Pressable>
        <Text className="font-hindi text-heading font-bold text-gray-900">
          अपनी जानकारी भरें
        </Text>
        <View className="h-10 w-10" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Name */}
        <View className="mb-6 mt-5">
          <Text className="mb-2 font-hindi text-body font-bold text-black">
            नाम
          </Text>
          <TextInput
            className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 font-hindi text-body text-gray-900"
            placeholder="अपना नाम लिखें"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Mobile */}
        <View className="mb-6">
          <Text className="mb-2 font-hindi text-body font-bold text-black">
            मोबाइल नंबर
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

        {/* Age */}
        <View className="mb-6">
          <Text className="mb-2 font-hindi text-body font-bold text-black">
            उम्र
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

        {/* Toggle card 1 */}
        <View className="mb-3 rounded-xl bg-button/10 border border-lightPinkBorder p-7">
          <Text className="mb-4 font-hindi text-body font-bold text-left text-gray-900">
            क्या आपके बच्चे हैं?
          </Text>
          <View className="flex-row gap-5 p-3">
            <Pressable
              onPress={() => setHasChildren(true)}
              className={`flex-1 items-center rounded-2xl border-2 py-3 ${
                hasChildren
                  ? 'border-lightPinkBorder bg-button'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <Text
                className={`font-hindi text-body font-bold ${
                  hasChildren ? 'text-white' : 'text-button'
                }`}
              >
                हाँ
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setHasChildren(false)}
              className={`flex-1 items-center rounded-2xl border-2 py-3 ${
                !hasChildren
                  ? 'border-lightPinkBorder bg-button'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <Text
                className={`font-hindi text-body font-bold ${
                  !hasChildren ? 'text-white' : 'text-button'
                }`}
              >
                नहीं
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Toggle card 2 */}
        <View className="mb-3 rounded-xl bg-button/10 border border-lightPinkBorder p-7">
          <Text className="mb-4 font-hindi text-body font-bold text-left text-gray-900">
            क्या आप उन्हें इंग्लिश सिखाना चाहती हैं?
          </Text>
          <View className="flex-row gap-5 p-3">
            <Pressable
              onPress={() => setWantsToTeach(true)}
              className={`flex-1 items-center rounded-2xl border-2 py-3 ${
                wantsToTeach
                  ? 'border-lightPinkBorder bg-button'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <Text
                className={`font-hindi text-body font-bold ${
                  wantsToTeach ? 'text-white' : 'text-button'
                }`}
              >
                हाँ
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setWantsToTeach(false)}
              className={`flex-1 items-center rounded-2xl border-2 py-3 ${
                !wantsToTeach
                  ? 'border-lightPinkBorder bg-button'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <Text
                className={`font-hindi text-body   font-bold ${
                  !wantsToTeach ? 'text-white' : 'text-button'
                }`}
              >
                नहीं
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Continue button */}
        <PrimaryButton
          onPress={() => {
            updateUser({
              userName: name?.trim() || 'आरती',
              phoneNumber: mobile?.trim() || '+91 98765 43210',
              age: age?.trim() || '',
            });
            navigation.navigate('MainTabs', {
              screen: 'Home',
              params: { userName: name?.trim() || 'आरती' },
            });
          }}
          label="जारी रखें (Continue)"
        />

        {/* Footer */}
        <View className="mt-4 flex-row items-center justify-center gap-2">
          <Text className="text-rest text-gray-500">ℹ</Text>
          <Text className="font-hindi text-rest text-gray-500">
            चिंता न करें, आप बाद में भी बदल सकती हैं
          </Text>
        </View>
      </ScrollView>
      </View>
    </View>
  );
}

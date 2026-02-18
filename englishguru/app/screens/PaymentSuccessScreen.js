import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { cardShadow } from '../theme/shadows';
import PrimaryButton from '../components/PrimaryButton';

const GREEN = '#22C55E';

export default function PaymentSuccessScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleStartLearning = () => {
    navigation.navigate('CoursesList');
  };

  const handleGoToHome = () => {
    navigation.navigate('CoursesList');
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 24 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Success icon with soft glow */}
        <View className="mt-8 items-center mb-4">
          <View
            className="h-24 w-24 items-center justify-center rounded-full bg-green-500"
            style={[
              cardShadow,
              {
                shadowColor: '#EC4899',
                shadowOpacity: 0.2,
                shadowRadius: 16,
              },
            ]}
          >
            <Icon name="check" size={56} color="#fff" />
          </View>
        </View>

        {/* Main heading */}
        <View className="flex-row items-center justify-center mb-2">
          <Text className="font-hindi text-2xl font-bold text-gray-900">
            भुगतान सफल हुआ
          </Text>
          <Text className="ml-1.5 text-xl">🎉</Text>
        </View>

        {/* Subtext */}
        <Text className="font-hindi text-center text-rest text-gray-600 mb-8">
          आपका सब्सक्रिप्शन शुरू हो गया है
        </Text>

        {/* Payment details card */}
        <View
          className="mb-6 rounded-2xl bg-[#FDF2F8] p-5"
          style={cardShadow}
        >
          <Text className="font-hindi text-body font-bold text-gray-900 mb-4">
            भुगतान विवरण
          </Text>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="font-hindi text-rest text-gray-700">प्लान</Text>
            <Text className="font-hindi text-rest font-medium text-gray-900">
              मासिक सब्सक्रिप्शन
            </Text>
          </View>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="font-hindi text-rest text-gray-700">स्थिति</Text>
            <View className="flex-row items-center">
              <Text className="font-hindi text-rest font-semibold text-green-600 mr-1.5">
                Paid
              </Text>
              <Icon name="check" size={18} color={GREEN} />
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="font-hindi text-rest text-gray-700">राशि</Text>
            <Text className="font-hindi text-rest font-bold text-button">
              ₹117 / महीना
            </Text>
          </View>
        </View>

        {/* Motivational message */}
        <Text className="font-hindi text-center text-body font-semibold text-button mb-10">
          अब आप सभी कोर्स और पाठ सीख सकती हैं
        </Text>

        {/* Buttons */}
        <PrimaryButton
          onPress={handleStartLearning}
          label="सीखना शुरू करें"
          style={cardShadow}
          className="mb-3"
        />
        <Pressable
          onPress={handleGoToHome}
          className="items-center justify-center rounded-xl border border-gray-300 bg-white py-4"
        >
          <Text className="font-hindi text-body font-bold text-gray-900">
            होम पर जाएँ
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

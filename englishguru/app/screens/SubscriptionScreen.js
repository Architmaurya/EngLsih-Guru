import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { cardShadow } from '../theme/shadows';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

const PINK = '#EC4899';

export default function SubscriptionScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleClose = () => navigation.goBack();
  const handleStartTrial = () => navigation.navigate('PaymentSuccess');
  const handleNotNow = () => navigation.goBack();

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="relative flex-row items-center justify-center px-4 py-3">
        <Pressable
          onPress={handleClose}
          hitSlop={12}
          className="absolute left-4 h-10 w-10 items-center justify-center"
        >
          <Icon name="x" size={24} color="#374151" />
        </Pressable>
        <Text className="font-hindi text-heading font-bold text-gray-800">
          सब्सक्रिप्शन
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero lock section */}
        <View className="mt-6 items-center mb-6">
          <View
            className="mb-5 h-24 w-24 items-center justify-center rounded-full bg-[#FCE7F3]"
            style={[cardShadow, { shadowColor: PINK, shadowOpacity: 0.12 }]}
          >
            <Icon name="lock" size={48} color={PINK} />
          </View>
          <Text className="font-hindi mt-2 text-heading  text-center  font-bold text-gray-800 mb-2">
            यह कंटेंट अभी लॉक है
          </Text>
          <Text className="font-hindi text-center text-rest text-gray-500 leading-[22px]">
            पूरा कोर्स देखने के लिए सब्सक्रिप्शन लें
          </Text>
        </View>

        {/* Feature highlight card */}
        <View className="mb-5 flex-row items-center rounded-[18px] border border-lightPinkBorder p-[18px]">
          <View className="mr-3.5 h-10 w-10 items-center justify-center rounded-full bg-button/15">
            <Icon name="shield" size={22} color={PINK} />
          </View>
          <Text className="font-hindi flex-1 text-rest font-bold leading-[22px] text-black">
            सभी कोर्स, सभी पाठ और सभी क्विज़ेस अनलॉक करें
          </Text>
        </View>

        {/* Pricing plan card – left-aligned text, light pink border, Best Offer badge */}
        <View
          className="mb-4 mt-2 overflow-visible rounded-[20px] border-2 border-lightPinkBorder bg-white p-8"
          style={cardShadow}
        >
          <View className="absolute right-0 top-0 z-10 overflow-hidden rounded-bl-2xl rounded-tr-[20px] bg-button pl-4 pr-3 pt-2 pb-1.5">
            <Text className="font-hindi text-xs font-bold text-white">
              बेस्ट ऑफर
            </Text>
          </View>
          <Text className="font-hindi text-heading font-bold text-black mb-2">
            ट्रायल सब्सक्रिप्शन
          </Text>
          <Text className="font-hindi text-heading font-extrabold text-button mb-1">
            ₹3<Text  className='text-rest text-black'> / दिन</Text> 
          </Text>
          <Text className="font-hindi text-rest text-gray-500">
            उसके बाद ₹117/महीना
          </Text>
        </View>

        {/* Auto-pay / cancel text – left-aligned with card */}
        <View className="mb-7  mt-3 flex-row justify-center items-center">
          <Icon name="refresh-cw" size={18} color="#1f2937" style={{ marginRight: 8 }} />
          <Text className="font-hindi text-center text-rest text-gray-900">
            ऑटो-पे • कभी भी कैंसल कर सकती हैं
          </Text>
        </View>

        {/* Bottom buttons */}
        <PrimaryButton
          onPress={handleStartTrial}
          label="₹3 में ट्रायल शुरू करें"
          rounded="14"
          style={cardShadow}
          className="mb-3"
        />
        <SecondaryButton onPress={handleNotNow} label="अभी नहीं" rounded="14" />
      </ScrollView>
    </View>
  );
}

import React from 'react';
import { Image, Platform, Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const logoShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  android: {
    elevation: 10,
  },
});

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <LinearGradient
      colors={['#FFF5F6', '#FEE2E7']}
      style={{ flex: 1 }}
    >
      <View className="flex-1 pt-8">
        <View className="flex-1 items-center justify-center px-4">
        {/* Top Logo - light pink circle with soft drop shadow */}
        <View className="mb-5 h-32 w-32 items-center justify-center rounded-full bg-[#FFEAF8]" style={logoShadow}>
          <Image
            source={require('../../assets/EnglishGurulogo.png')}
            className="h-18 w-18 "
            resizeMode="contain"
          />
        </View>

        {/* App Title - heading 24, Open Sans */}
        <Text className="mt-3 font-openSans text-heading font-bold text-[#9A1A8F]">
          English Guru
        </Text>

        {/* Greeting - rest 14, Hindi */}
        <Text className="mt-3 font-hindi text-heading font-semibold text-gray-900">
          नमस्ते!
        </Text>

        {/* Subtitle - body 18, Hindi */}
        <Text className="mt-2 px-8 text-center font-hindi text-heading text-gray-600">
          अब इंग्लिश सीखना हुआ आसान।
        </Text>

        {/* Character Image */}
        <Image
          source={require('../../assets/English.png')}
          className="my-6 h-44 w-44"
          resizeMode="contain"
        />

        {/* Bottom Hindi Line - rest 14, Hindi */}
        <Text className="mt-2 px-10 text-center font-hindi text-body text-gray-700">
          भारत की महिलाओं के लिए ख़ास बनाया गया।
        </Text>

        {/* Google Button - button color #FF48A7, body 18, Open Sans */}
        <Pressable
          onPress={() => navigation.navigate('FillInfo')}
          className="mt-10 h-14 w-[90%] flex-row items-center justify-center gap-3 rounded-xl bg-white  shadow-md active:opacity-90"
        >
          <Image
            source={require('../../assets/google.png')}
            className="h-5 w-5"
            resizeMode="contain"
          />
          <Text className="font-openSans text-body font-bold text-black">
            Continue with Google
          </Text>
        </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

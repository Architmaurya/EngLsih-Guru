import React from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import ScreenHeader from '../components/ScreenHeader';
import ContentCard from '../components/ContentCard';

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleEmail = () => {
    Linking.openURL('mailto:support@englishguru.com');
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <ScreenHeader onBack={() => navigation.goBack()} title="Help & Support" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}
      >
        <ContentCard
          title="Support available"
          titleClassName="font-hindi text-body font-bold text-gray-900 mb-2"
          className="rounded-2xl bg-[#FDF2F8] p-5 mb-4"
        >
          <Text className="font-openSans text-rest text-gray-700">9 AM - 9 PM (IST)</Text>
        </ContentCard>
        <ContentCard
          title="संपर्क करें (Contact us)"
          titleClassName="font-hindi text-rest font-semibold text-gray-800 mb-2"
          className="rounded-2xl bg-gray-50 p-5 mb-4"
        >
          <Pressable onPress={handleEmail} className="flex-row items-center mt-2">
            <Icon name="mail" size={20} color="#EC4899" />
            <Text className="font-openSans ml-2 text-rest text-button">support@englishguru.com</Text>
          </Pressable>
        </ContentCard>
      </ScrollView>
    </View>
  );
}

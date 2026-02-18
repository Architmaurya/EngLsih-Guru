import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import ScreenHeader from '../components/ScreenHeader';
import ContentCard from '../components/ContentCard';

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user } = useUser();

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <ScreenHeader onBack={() => navigation.goBack()} title="Privacy & Security" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}
      >
        <ContentCard
          title="Google login details"
          className="rounded-2xl bg-gray-50 p-5 mb-4"
        >
          <Text className="font-openSans text-rest text-gray-600 leading-5">
            You signed in with Google. Your account email and profile are managed by Google. To change your password or security settings, visit your Google Account.
          </Text>
        </ContentCard>
        <ContentCard
          title="Logged in as"
          className="rounded-2xl bg-gray-50 p-5"
        >
          <Text className="font-openSans text-body text-gray-900">{user.userName}</Text>
          <Text className="font-openSans mt-1 text-rest text-gray-500">{user.phoneNumber}</Text>
        </ContentCard>
      </ScrollView>
    </View>
  );
}

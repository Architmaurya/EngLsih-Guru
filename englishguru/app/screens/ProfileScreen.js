import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { useUser } from '../context/UserContext';
import MenuRow from '../components/MenuRow';
import SecondaryButton from '../components/SecondaryButton';
import ConfirmModal from '../components/ConfirmModal';

const MENU_ITEMS = [
  { id: 'details', icon: 'user', title: 'Profile Details', subtitle: 'नाम, उम्र', screen: 'ProfileDetails' },
  { id: 'contact', icon: 'phone', title: 'Contact', subtitle: 'फोन नंबर बदलें', screen: 'Contact' },
  { id: 'privacy', icon: 'shield', title: 'Privacy & Security', subtitle: 'Google login details', screen: 'Privacy' },
  { id: 'help', icon: 'message-circle', title: 'Help & Support', subtitle: 'Support available 9 AM - 9 PM', screen: 'Help' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user } = useUser();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const userName = user.userName || 'Anjali Sharma';
  const phoneNumber = user.phoneNumber || '+91 98765 43210';
  const profileImageUri = user.profileImageUri;

  const handleEditPhoto = () => {
    // TODO: image picker – Take Photo / Choose from Gallery
  };

  const handleMenuPress = (screen) => {
    navigation.navigate(screen);
  };

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);

  const confirmLogout = () => {
    setShowLogoutModal(false);
    let root = navigation;
    while (root.getParent()) root = root.getParent();
    root.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    );
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="items-center pt-4 pb-2">
       
        <Text className="font-hindi text-center text-xl font-bold text-black">
          प्रोफ़ाइल (Profile)
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 24 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mt-4 mb-8">
          <View className="relative">
            {profileImageUri ? (
              <View className="h-28 w-28 overflow-hidden rounded-full border-[3px] border-[#FCE7F3]">
                <Image source={{ uri: profileImageUri }} className="h-full w-full" resizeMode="cover" />
              </View>
            ) : (
              <View className="h-28 w-28 items-center justify-center rounded-full border-[3px] border-[#FCE7F3] bg-gray-200 overflow-hidden">
                <Text className="font-openSans text-4xl font-bold text-gray-600">
                  {(userName || 'A').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Pressable
              onPress={handleEditPhoto}
              className="absolute bottom-0 right-0 h-9 w-9 items-center justify-center rounded-full bg-button"
            >
              <Icon name="edit-2" size={18} color="#fff" />
            </Pressable>
          </View>
          <Text className="font-hindi mt-4 text-xl font-bold text-black">
            {userName}
          </Text>
          <Text className="font-hindi mt-1 text-rest text-black">
            {phoneNumber}
          </Text>
        </View>

        <View className="gap-3">
          {MENU_ITEMS.map((item) => (
            <MenuRow
              key={item.id}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              onPress={() => handleMenuPress(item.screen)}
            />
          ))}
        </View>

        <View className="mt-8">
          <SecondaryButton onPress={openLogoutModal} label="Logout" />
        </View>
      </ScrollView>

      <ConfirmModal
        visible={showLogoutModal}
        onRequestClose={closeLogoutModal}
        title="Logout"
        message="क्या आप लॉग आउट करना चाहती हैं?"
        cancelLabel="Cancel"
        confirmLabel="Logout"
        onCancel={closeLogoutModal}
        onConfirm={confirmLogout}
      />
    </View>
  );
}

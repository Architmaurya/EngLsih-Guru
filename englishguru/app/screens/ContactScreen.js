import React, { useState, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import ScreenHeader from '../components/ScreenHeader';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';

export default function ContactScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, updateUser } = useUser();
  const [phone, setPhone] = useState(user.phoneNumber || '');

  useEffect(() => {
    setPhone(user.phoneNumber || '');
  }, [user.phoneNumber]);

  const handleSave = () => {
    updateUser({ phoneNumber: phone.trim() || user.phoneNumber });
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <ScreenHeader onBack={() => navigation.goBack()} title="Contact" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <FormField
          label="फोन नंबर (Phone Number)"
          value={phone}
          onChangeText={setPhone}
          placeholder="+91 98765 43210"
          keyboardType="phone-pad"
        />
        <PrimaryButton onPress={handleSave} label="सेव करें (Save)" />
      </ScrollView>
    </View>
  );
}

import React, { useState, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import ScreenHeader from '../components/ScreenHeader';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';

export default function ProfileDetailsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, updateUser } = useUser();
  const [name, setName] = useState(user.userName || '');
  const [age, setAge] = useState(user.age || '');

  useEffect(() => {
    setName(user.userName || '');
    setAge(user.age || '');
  }, [user.userName, user.age]);

  const handleSave = () => {
    updateUser({ userName: name.trim() || user.userName, age: age.trim() });
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <ScreenHeader onBack={() => navigation.goBack()} title="Profile Details" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <FormField
          label="नाम (Name)"
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          inputClassName="mb-5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-openSans text-body text-gray-900"
        />
        <FormField
          label="उम्र (Age)"
          value={age}
          onChangeText={setAge}
          placeholder="Enter age"
          keyboardType="number-pad"
        />
        <PrimaryButton onPress={handleSave} label="सेव करें (Save)" />
      </ScrollView>
    </View>
  );
}

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ProfileScreen from '../screens/app/ProfileTab/ProfileScreen/ProfileScreen';
import ProfileDetailsScreen from '../screens/app/ProfileTab/ProfileDetailsScreen/ProfileDetailsScreen';
import ContactScreen from '../screens/app/ProfileTab/ContactScreen/ContactScreen';
import PrivacyScreen from '../screens/app/ProfileTab/PrivacyScreen/PrivacyScreen';
import HelpScreen from '../screens/app/ProfileTab/HelpScreen/HelpScreen';

const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="ProfileDetails" component={ProfileDetailsScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
    </Stack.Navigator>
  );
}

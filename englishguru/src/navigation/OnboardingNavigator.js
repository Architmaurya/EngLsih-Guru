import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FillInfoScreen from '../screens/onboarding/FillInfoScreen/FillInfoScreen';

const Stack = createStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="FillInfo" component={FillInfoScreen} />
    </Stack.Navigator>
  );
}

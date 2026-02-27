import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';

import HomeScreen from '../screens/auth/HomeScreen/HomeScreen';
import FillInfoScreen from '../screens/onboarding/FillInfoScreen/FillInfoScreen';
import MainTabs from './MainTabs';
import { hydrateAuth } from '../store/authSlice';
import { selectAuth } from '../store';

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FillInfo" component={FillInfoScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);

  useEffect(() => {
    if (auth.status === 'idle') {
      dispatch(hydrateAuth());
    }
  }, [auth.status, dispatch]);

  if (auth.status === 'idle' || auth.status === 'loading') {
    return null;
  }

  if (!auth.isLoggedIn) {
    return <AuthStack />;
  }

  if (!auth.hasCompletedOnboarding) {
    return <OnboardingStack />;
  }

  return <AppStack />;
}


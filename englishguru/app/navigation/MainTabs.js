import React from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import HomeStack from './HomeStack';
import PracticeScreen from '../screens/PracticeScreen';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

const ACTIVE_COLOR = '#FF48A7';
const INACTIVE_COLOR = '#8B7355';

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'CoursesList';
        const hideTabBar = routeName === 'CourseDetail' || routeName === 'Lesson' || routeName === 'LessonPractice' || routeName === 'LessonComplete' || routeName === 'Subscription' || routeName === 'PaymentSuccess';
        return {
          headerShown: false,
          tabBarActiveTintColor: ACTIVE_COLOR,
          tabBarInactiveTintColor: INACTIVE_COLOR,
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            display: hideTabBar ? 'none' : 'flex',
          },
          tabBarLabelStyle: {
            fontFamily: 'Plus Jakarta Sans',
            fontSize: 12,
          },
        };
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'होम',
          tabBarIcon: ({ color, size }) => <Icon name="home" size={size || 24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Practice"
        component={PracticeScreen}
        options={{
          tabBarLabel: 'अभ्यास',
          tabBarIcon: ({ color, size }) => <Icon name="message-circle" size={size || 24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'प्रोफाइल',
          tabBarIcon: ({ color, size }) => <Icon name="user" size={size || 24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

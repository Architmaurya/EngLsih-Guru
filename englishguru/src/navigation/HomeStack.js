import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CoursesScreen from '../screens/app/HomeTab/CoursesScreen/CoursesScreen';
import CourseDetailScreen from '../screens/app/HomeTab/CourseDetailScreen/CourseDetailScreen';
import LessonScreen from '../screens/app/HomeTab/LessonScreen/LessonScreen';
import LessonPracticeScreen from '../screens/app/HomeTab/LessonPracticeScreen/LessonPracticeScreen';
import LessonCompleteScreen from '../screens/app/HomeTab/LessonCompleteScreen/LessonCompleteScreen';
import SubscriptionScreen from '../screens/app/HomeTab/SubscriptionScreen/SubscriptionScreen';
import PaymentSuccessScreen from '../screens/app/HomeTab/PaymentSuccessScreen/PaymentSuccessScreen';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CoursesList" component={CoursesScreen} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
      <Stack.Screen name="Lesson" component={LessonScreen} />
      <Stack.Screen name="LessonPractice" component={LessonPracticeScreen} />
      <Stack.Screen
        name="LessonComplete"
        component={LessonCompleteScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
    </Stack.Navigator>
  );
}

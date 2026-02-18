import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CoursesScreen from '../screens/CoursesScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import LessonScreen from '../screens/LessonScreen';
import LessonPracticeScreen from '../screens/LessonPracticeScreen';
import LessonCompleteScreen from '../screens/LessonCompleteScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import PaymentSuccessScreen from '../screens/PaymentSuccessScreen';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CoursesList" component={CoursesScreen} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
      <Stack.Screen name="Lesson" component={LessonScreen} />
      <Stack.Screen name="LessonPractice" component={LessonPracticeScreen} />
      <Stack.Screen name="LessonComplete" component={LessonCompleteScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
    </Stack.Navigator>
  );
}

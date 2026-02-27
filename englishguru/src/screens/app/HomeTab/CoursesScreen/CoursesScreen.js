import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { cardShadowStrong, styles, CARD_IMAGE_HEIGHT } from './CoursesScreen.styles';
import { courses } from '../../../../data/courses';

function getProgressPercent(course) {
  if (!course.lessons || course.lessons.length === 0) return 0;
  const completed = course.lessons.filter((l) => l.completed).length;
  return Math.round((completed / course.lessons.length) * 100);
}

function CourseCard({ course, unlocked, onRestart, onContinue, onPressLocked }) {
  const progressPercent = getProgressPercent(course);
  const isCompleted = progressPercent >= 100;

  return (
    <View className="mb-4 overflow-hidden rounded-2xl bg-white" style={cardShadowStrong}>
      <View
        style={[
          styles.cardImageContainer,
          { height: CARD_IMAGE_HEIGHT },
        ]}
      >
        {course.image != null ? (
          <Image
            source={course.image}
            style={styles.cardImage}
            resizeMode="cover"
          />
        ) : (
          <View className="h-full w-full bg-gray-400" />
        )}
        {!unlocked && (
          <>
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
            <View className="absolute right-3 top-3 items-center justify-center  p-2">
              <Icon name="lock" size={24} color="white" />
            </View>
          </>
        )}
        <View className="absolute bottom-3 left-2 rounded-lg bg-button px-3 py-1.5">
          <Text className="font-hindi text-rest font-bold text-white">नया पाठ</Text>
        </View>
      </View>

      {unlocked && (
        <View className="flex-row items-center gap-3 px-4 pt-3">
          <View className="flex-1 h-2 overflow-hidden rounded-full bg-gray-200">
            <View
              className="h-full rounded-full bg-button"
              style={{ width: `${progressPercent}%` }}
            />
          </View>
          <Text className="font-hindi text-rest text-gray-600">
            {progressPercent}% प्रगति
          </Text>
        </View>
      )}

      <View className="flex-row items-center justify-between gap-3 px-4 pb-4 pt-3">
        <View className="min-w-0 flex-1">
          <Text className="font-hindi text-body font-bold text-gray-900" numberOfLines={2}>
            {course.titleHi}
          </Text>
          <Text className="mt-1 font-openSans text-rest text-gray-500" numberOfLines={1}>
            {course.titleEn}
          </Text>
        </View>
        <View className="items-center justify-center">
          {unlocked ? (
            isCompleted ? (
              <Pressable
                onPress={onRestart}
                className="flex-row items-center rounded-xl border-2 border-button bg-white px-4 py-2.5 active:opacity-80"
              >
                <Text className="font-hindi text-rest font-bold text-button">फिर से शुरू करें </Text>
                <Icon name="arrow-right" size={18} color="#FF48A7" />
              </Pressable>
            ) : (
              <Pressable
                onPress={onContinue}
                className="flex-row items-center rounded-xl bg-button px-4 py-2.5 active:opacity-90"
              >
                <Text className="font-hindi text-rest font-bold text-white">जारी रखें </Text>
                <Icon name="arrow-right" size={18} color="#fff" />
              </Pressable>
            )
          ) : (
            <Pressable
              onPress={onPressLocked}
              className="flex-row items-center rounded-xl bg-button px-4 py-2.5 active:opacity-90"
            >
              <Text className="font-hindi text-rest font-bold text-white">शुरू करें </Text>
              <Icon name="arrow-right" size={18} color="#fff" />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

export default function CoursesScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const userName = route.params?.userName ?? 'आरती';

  const openCourseDetail = (course) => {
    navigation.navigate('CourseDetail', { course });
  };

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: '#F5F0F8', paddingTop: insets.top }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-4 mt-2 flex-row items-center justify-between rounded-2xl bg-white px-5 py-4">
          <View className="flex-1">
            <Text className="font-hindi text-heading font-bold text-gray-900">
              नमस्ते, {userName} 🌸
            </Text>
            <Text className="mt-1 font-openSans text-body text-gray-600">
              Welcome,{userName}
            </Text>
          </View>
          <View
            className="h-14 w-14 items-center justify-center rounded-full bg-gray-200"
            style={{ borderWidth: 2, borderColor: '#FF48A7' }}
          >
            <Text className="font-openSans text-body font-bold text-gray-600">
              {(userName || 'आ').charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        <View className="mx-4 mt-4 flex-row gap-4">
          <View
            className="flex-1 items-center rounded-2xl bg-white py-5"
            style={cardShadowStrong}
          >
          <View className="flex-row items-center gap-2">
          <Text className="mb-3 mt-2 text-4xl">🔥</Text>
          <Text className="mb-1 font-hindi text-heading text-button">स्ट्रीक</Text>
          </View>
            <Text className="font-hindi text-heading font-bold text-gray-900">5 दिन</Text>
          </View>
          <View
            className="flex-1 items-center rounded-2xl bg-white py-5"
            style={cardShadowStrong}
          >
          <View className="flex-row items-center gap-2">
          <Text className="mb-3 mt-2 text-4xl">🥇</Text>
          <Text className="mb-1 font-hindi text-heading text-button">कुल पॉइंट्स</Text>
          </View>
            <Text className="font-hindi text-heading font-bold text-gray-900">120</Text>
          </View>
        </View>

        <View className="px-4 mt-4 mb-2 pb-3">
          <Text className="font-hindi text-heading font-bold text-gray-900">
            आपके कोर्स (Your Courses)
          </Text>
        </View>

        <View className="px-4">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              unlocked={course.unlocked === true}
              onRestart={() => openCourseDetail(course)}
              onContinue={() => openCourseDetail(course)}
              onPressLocked={() => navigation.navigate('Subscription')}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

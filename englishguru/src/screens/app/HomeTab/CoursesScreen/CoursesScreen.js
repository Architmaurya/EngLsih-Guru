import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { useUser } from '../../../../context/UserContext';
import { cardShadowStrong, styles, CARD_IMAGE_HEIGHT } from './CoursesScreen.styles';
import { getAssetImageUrl } from '../../../../config/env';
import { courses as staticCourses } from '../../../../data/courses';
import { useUserStats } from '../../../../hooks/useUserStats';
import { getCategories } from '../../../../services/categories/categoriesService';
import { getModulesByClass } from '../../../../services/modules/modulesService';

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
            source={typeof course.image === 'number' ? course.image : { uri: course.image?.uri || course.image }}
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

function mapCategoryToCourse(cat) {
  const id = cat._id || cat.id;
  const name = cat.name || '';
  const rawImage = cat.thumbnail || cat.icon;
  const imageUrl = getAssetImageUrl(rawImage);
  if (name && imageUrl) {
    console.log(`[CoursesScreen] Image URL for "${name}" → open in Chrome:`, imageUrl);
  } else if (name && rawImage) {
    console.log(`[CoursesScreen] Raw thumbnail/icon for "${name}":`, rawImage, '→ resolved URL:', imageUrl);
  } else if (name) {
    console.log(`[CoursesScreen] No thumbnail/icon for "${name}"`);
  }
  return {
    id,
    titleHi: name,
    titleEn: name,
    image: imageUrl ? { uri: imageUrl } : null,
    lessons: [],
    source: 'api',
    unlocked: cat.hasAccess !== false,
  };
}

function mapModuleToCourse(mod) {
  const id = mod._id || mod.id;
  const title = mod.title || '';
  const imageUrl = getAssetImageUrl(mod.thumbnail);
  return {
    id,
    titleHi: title,
    titleEn: title,
    image: imageUrl ? { uri: imageUrl } : null,
    lessons: [],
    source: 'module',
    unlocked: mod.hasAccess !== false,
  };
}

export default function CoursesScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const userName = (user?.userName || route.params?.userName) ?? 'आरती';
  const userClass = user?.class != null ? user.class : 1;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useClassModules, setUseClassModules] = useState(false);
  const { streakDays, totalPoints } = useUserStats();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      console.log('[CoursesScreen] load started', { userClass });
      setLoading(true);
      setError(null);
      try {
        console.log('[CoursesScreen] fetching categories (limit 20)');
        const { data: categoriesData } = await getCategories({ limit: 20 });
        if (cancelled) return;
        console.log('[CoursesScreen] categories response', { count: categoriesData?.length, ids: categoriesData?.map((c) => c._id || c.id) });
        if (categoriesData?.length > 0) {
          const mapped = categoriesData.map(mapCategoryToCourse);
          console.log('[CoursesScreen] using categories as courses', { count: mapped.length, titles: mapped.map((c) => c.titleHi) });
          setCourses(mapped);
          setUseClassModules(false);
          return;
        }
        console.log('[CoursesScreen] no categories, fetching modules by class', { userClass });
        const { data: modulesData } = await getModulesByClass(userClass, { limit: 20 });
        if (cancelled) return;
        console.log('[CoursesScreen] modules response', { count: modulesData?.length, class: userClass });
        if (modulesData?.length > 0) {
          const mapped = modulesData.map(mapModuleToCourse);
          console.log('[CoursesScreen] using modules as courses', { count: mapped.length, titles: mapped.map((c) => c.titleHi) });
          setCourses(mapped);
          setUseClassModules(true);
          return;
        }
        console.log('[CoursesScreen] no API data, using static courses', { staticCount: staticCourses.length });
        setCourses(staticCourses);
      } catch (e) {
        if (!cancelled) {
          console.log('[CoursesScreen] load error', { message: e?.message, stack: e?.stack });
          setError(e?.message);
          setCourses(staticCourses);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          console.log('[CoursesScreen] load finished');
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [userClass]);

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
            <Text className="font-hindi text-heading font-bold text-gray-900">
              {streakDays} दिन
            </Text>
          </View>
          <View
            className="flex-1 items-center rounded-2xl bg-white py-5"
            style={cardShadowStrong}
          >
            <View className="flex-row items-center gap-2">
              <Text className="mb-3 mt-2 text-4xl">🥇</Text>
              <Text className="mb-1 font-hindi text-heading text-button">कुल पॉइंट्स</Text>
            </View>
            <Text className="font-hindi text-heading font-bold text-gray-900">
              {totalPoints}
            </Text>
          </View>
        </View>

        <View className="px-4 mt-4 mb-2 pb-3">
          <Text className="font-hindi text-heading font-bold text-gray-900">
            आपके कोर्स (Your Courses)
          </Text>
        </View>

        <View className="px-4">
          {loading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#FF48A7" />
              <Text className="mt-3 font-hindi text-rest text-gray-600">कोर्स लोड हो रहे हैं...</Text>
            </View>
          ) : error ? (
            <View className="py-4">
              <Text className="font-openSans text-rest text-gray-500 text-center">{error}</Text>
              <Text className="mt-2 font-hindi text-rest text-gray-500 text-center">नीचे डिफ़ॉल्ट कोर्स दिखाए जा रहे हैं।</Text>
            </View>
          ) : null}
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

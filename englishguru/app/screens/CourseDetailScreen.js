import React, { useMemo, useState } from 'react';
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
import { cardShadowStrong } from '../theme/shadows';

const HEADER_IMAGE_HEIGHT = 240;
const PINK = '#FF48A7';
const GREEN = '#22C55E';
const LIGHT_PINK_BORDER = '#FFB6D9';

function LessonCard({ lesson, index, unlocked, completed, selected, onPress }) {
  // 1) Completed: green check left, green check right, light border
  // 2) Selected: pink left bar, pink number circle, pink play right
  // 3) Unselected (unlocked): grey circle, no right icon
  // 4) Locked: grey circle, lock right

  const durationStyle = { color: PINK };
  const isLocked = !unlocked;

  let leftContent;
  let rightContent;
  let cardStyle = [cardShadowStrong, { borderWidth: 1, borderColor: '#E5E7EB' }];
  let showLeftBorder = false;

  if (completed) {
    leftContent = (
      <View className="h-10 w-10 items-center justify-center rounded-full bg-green-100">
        <Icon name="check" size={22} color={GREEN} />
      </View>
    );
    rightContent = <Icon name="check" size={24} color={GREEN} />;
    cardStyle = [cardShadowStrong, { borderWidth: 1, borderColor: LIGHT_PINK_BORDER }];
  } else if (selected) {
    leftContent = (
      <View className="h-10 w-10 items-center justify-center rounded-full bg-button">
        <Text className="font-openSans text-body font-bold text-white">{index + 1}</Text>
      </View>
    );
    rightContent = (
      <View className="h-10 w-10 items-center justify-center rounded-full bg-button">
        <Icon name="play" size={20} color="#fff" />
      </View>
    );
    cardStyle = [cardShadowStrong, { borderWidth: 2, borderColor: '#FFB6D9' }];
    showLeftBorder = true;
  } else if (isLocked) {
    leftContent = (
      <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-300">
        <Text className="font-openSans text-body font-bold text-gray-600">{index + 1}</Text>
      </View>
    );
    rightContent = <Icon name="lock" size={24} color="#9CA3AF" />;
  } else {
    leftContent = (
      <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-300">
        <Text className="font-openSans text-body font-bold text-gray-600">{index + 1}</Text>
      </View>
    );
    rightContent = null;
  }

  const CARD_RADIUS = 12;

  return (
    <View
      className="mb-3 flex-row rounded-xl bg-white py-3 px-3"
      style={[cardStyle, { width: '100%', position: 'relative' }]}
    >
      {showLeftBorder && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 5,
            backgroundColor: PINK,
            borderTopLeftRadius: CARD_RADIUS,
            borderBottomLeftRadius: CARD_RADIUS,
          }}
        />
      )}
      <Pressable
        onPress={unlocked ? () => onPress(lesson, index) : undefined}
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingRight: 16, paddingLeft: 12 }}
      >
        <View style={{ width: 40 }}>{leftContent}</View>
        <View style={{ flex: 1, marginLeft: 12, minWidth: 0 }}>
          <Text className="font-hindi text-body font-bold text-gray-900" numberOfLines={1}>
            {index + 1}. {lesson.title}
          </Text>
          {(lesson.titleEn != null && lesson.titleEn !== '') ? (
            <Text className="mt-0.5 mb-2 font-openSans text-rest text-gray-600" numberOfLines={1}>
              {lesson.titleEn}
            </Text>
          ) : null}
          <Text className="mt-0.5 font-openSans text-rest" style={durationStyle}>
            5 मिनट
          </Text>
        </View>
        {rightContent != null ? <View style={{ marginLeft: 8 }}>{rightContent}</View> : <View style={{ marginLeft: 8, width: 40 }} />}
      </Pressable>
    </View>
  );
}

export default function CourseDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const course = route.params?.course;

  const defaultSelectedIndex = useMemo(() => {
    const lessons = course?.lessons || [];
    const firstIncomplete = lessons.findIndex((l) => l.unlocked && !l.completed);
    if (firstIncomplete >= 0) return firstIncomplete;
    const firstUnlocked = lessons.findIndex((l) => l.unlocked);
    return firstUnlocked >= 0 ? firstUnlocked : 0;
  }, [course?.lessons]);

  const [selectedLessonIndex, setSelectedLessonIndex] = useState(defaultSelectedIndex);

  if (!course) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="font-openSans text-body text-gray-600">No course selected.</Text>
        <Pressable onPress={() => navigation.goBack()} className="mt-4 rounded-xl bg-button px-6 py-2">
          <Text className="font-hindi text-body font-bold text-white">वापस जाएं</Text>
        </Pressable>
      </View>
    );
  }

  const totalMinutes = course.lessons?.length ? course.lessons.length * 5 : 0;

  const handleBack = () => navigation.goBack();
  const handleShare = () => {
    // Placeholder: could use react-native-share or Linking
  };
  const handleLessonPress = (lesson, index) => {
    setSelectedLessonIndex(index);
    navigation.navigate('Lesson', { lesson, course });
  };
  const handleContinueCourse = () => {
    const firstUnlocked = course.lessons?.findIndex((l) => l.unlocked) ?? 0;
    const lesson = course.lessons?.[firstUnlocked];
    if (lesson) handleLessonPress(lesson, firstUnlocked);
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header image + back + share */}
        <View style={{ height: HEADER_IMAGE_HEIGHT, width: '100%', position: 'relative' }}>
          {course.image && (
            <Image
              source={course.image}
              style={[StyleSheet.absoluteFillObject, { width: '100%', height: '100%' }]}
              resizeMode="cover"
            />
          )}
          <Pressable
            onPress={handleBack}
            className="absolute left-4 top-4 h-10 w-10 items-center justify-center rounded-full bg-white"
          >
            <Icon name="chevron-left" size={24} color="#1f2937" />
          </Pressable>
          <Pressable
            onPress={handleShare}
            className="absolute right-4 top-4 h-10 w-10 items-center justify-center rounded-full bg-white"
          >
            <Icon name="share-2" size={20} color="#1f2937" />
          </Pressable>
        </View>

        {/* Title block */}
        <View className="px-4 pt-4">
          <Text className="font-hindi text-heading font-bold text-gray-900">
            {course.titleHi}
          </Text>
          <Text className="mt-1 font-openSans text-rest text-gray-500">
            {course.titleEn}
          </Text>
        </View>

        {/* Stats row */}
        <View className="mt-3 flex-row items-center gap-3 px-4">
          <View className="rounded-full bg-button/10 px-4 py-3">
            <Text className="font-hindi text-rest font-bold text-button">
              {course.lessons?.length ?? 0} आसान पाठ ({course.lessons?.length ?? 0} Lessons)
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Icon name="clock" size={18} color="#6B7280" />
            <Text className="font-hindi text-rest text-gray-600">
              {totalMinutes} मिनट कुल
            </Text>
          </View>
        </View>

        {/* पाठ सूची */}
        <View className="mt-6 px-4 flex-row items-center gap-3">
          <Text className="font-hindi text-heading font-bold text-button">
            पाठ सूची
          </Text>
          <View
            style={{
              flex: 1,
              height: 2,
              backgroundColor: PINK,
              borderRadius: 1,
              opacity: 0.6,
            }}
          />
        </View>

        {/* Lesson list */}
        <View className="mt-3 px-4">
          {(course.lessons || []).map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              index={index}
              unlocked={lesson.unlocked === true}
              completed={lesson.completed === true}
              selected={index === selectedLessonIndex}
              onPress={handleLessonPress}
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white px-4 pb-8 pt-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable
          onPress={handleContinueCourse}
          className="flex-row items-center justify-center gap-2 rounded-xl bg-button py-3.5 active:opacity-90"
        >
          <Icon name="play-circle" size={24} color="#fff" />
          <Text className="font-hindi text-body font-bold text-white">
            कोर्स जारी रखें (Continue Course)
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

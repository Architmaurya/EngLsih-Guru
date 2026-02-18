import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { cardShadow } from '../theme/shadows';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

const GREEN = '#22C55E';

export default function LessonCompleteScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { lesson, course, correctCount = 0, videoCompletedOnce = false } = route.params || {};

  const totalQuestions = 2;
  const scoreOutOf10 = totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 10);
  const worksheetPoints = scoreOutOf10;
  const hasNextLesson = (() => {
    const lessons = course?.lessons || [];
    const idx = lessons.findIndex((l) => l.id === lesson?.id);
    return idx >= 0 && idx < lessons.length - 1;
  })();

  const handleNextLesson = () => {
    if (hasNextLesson) {
      const lessons = course.lessons || [];
      const idx = lessons.findIndex((l) => l.id === lesson.id);
      const next = lessons[idx + 1];
      if (next) navigation.replace('Lesson', { lesson: next, course });
    } else {
      navigation.navigate('Subscription');
    }
  };

  const handleBackToCourse = () => {
    navigation.navigate('CourseDetail', { course });
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 24 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Success icon */}
        <View className="mt-6 items-center mb-4">
          <View
            className="h-[88px] w-[88px] items-center justify-center rounded-full bg-green-500"
            style={[cardShadow, { shadowColor: GREEN, shadowOpacity: 0.35 }]}
          >
            <Icon name="check" size={48} color="#fff" />
          </View>
        </View>

        {/* Main heading */}
        <Text className="font-hindi text-center text-xl font-bold text-gray-800 mb-2 px-2">
          बहुत बढ़िया! आपने यह लेसन पूरा कर लिया 🎉
        </Text>

        {/* Subtext */}
        <Text className="font-hindi text-center text-rest text-gray-500 mb-6">
          आप हर दिन बेहतर बनते जा रहे हैं 💪
        </Text>

        {/* Score card */}
        <View className="mb-5 rounded-[20px] bg-white p-6" style={cardShadow}>
          <Text className="font-hindi text-center text-xs font-semibold tracking-wide text-gray-500 mb-3">
            आपका स्कोर
          </Text>
          <Text className="font-hindi text-center text-4xl font-extrabold text-button mb-3">
            {scoreOutOf10} / 10
          </Text>
          {scoreOutOf10 === 10 && (
            <View className="self-center flex-row items-center rounded-full border border-yellow-300 bg-[#FEF9C3] px-3.5 py-2">
              <Text className="font-hindi text-rest font-bold text-yellow-800">
                +10 बोनस अंक
              </Text>
              <Text className="ml-1">✨</Text>
            </View>
          )}
        </View>

        {/* Lesson summary */}
        <View className="mb-5 rounded-[20px] bg-white p-5" style={cardShadow}>
          <Text className="font-hindi text-[17px] font-bold text-gray-800 mb-4">
            लेसन सारांश
          </Text>

          {videoCompletedOnce && (
            <View className="mb-3 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="mr-3 h-6 w-6 items-center justify-center rounded-full bg-green-500">
                  <Icon name="check" size={14} color="#fff" />
                </View>
                <Text className="font-hindi text-[15px] text-gray-800">
                  Video पूरा हुआ
                </Text>
              </View>
              <Text className="font-hindi text-[15px] font-bold text-button">
                +5 अंक
              </Text>
            </View>
          )}

          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="mr-3 h-6 w-6 items-center justify-center rounded-full bg-green-500">
                <Icon name="check" size={14} color="#fff" />
              </View>
              <Text className="font-hindi text-[15px] text-gray-800">
                {scoreOutOf10 === 10 ? 'बेहतरीन स्कोर' : 'वर्कशीट स्कोर'}
              </Text>
            </View>
            <Text className="font-hindi text-[15px] font-bold text-button">
              +{worksheetPoints} अंक
            </Text>
          </View>

          {/* Progress bar */}
          <View className="mt-1">
            <View className="mb-2 flex-row justify-between">
              <Text className="font-hindi text-rest text-gray-500">
                प्रगति
              </Text>
              <Text className="font-hindi text-rest font-semibold text-gray-800">
                100%
              </Text>
            </View>
            <View className="h-2 overflow-hidden rounded bg-gray-100">
              <View className="absolute left-0 top-0 bottom-0 w-full rounded bg-button" />
            </View>
          </View>
        </View>

        {/* Bottom buttons – part of scroll content */}
        <View className="mt-6 mb-2">
          <PrimaryButton
            onPress={handleNextLesson}
            label={`अगला पाठ शुरू करें ${hasNextLesson ? '' : '🔒'}`}
            rounded="14"
            style={cardShadow}
            className="mb-3"
          />
          <SecondaryButton onPress={handleBackToCourse} label="कोर्स पर वापस जाएं" rounded="14" />
        </View>
      </ScrollView>
    </View>
  );
}

import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { cardShadow } from '../theme/shadows';

const GREEN = '#22C55E';

const PRACTICE_MODULES = [
  {
    id: 1,
    titleHi: 'अभ्यास पत्र 1: अभिवादन',
    titleEn: 'Greetings',
    score: 10,
    maxScore: 10,
    status: 'completed',
    locked: false,
    actionLabel: 'दुबारा करें',
  },
  {
    id: 2,
    titleHi: 'अभ्यास पत्र 2: स्वयं का परिचय',
    titleEn: 'Self Intro',
    score: 9,
    maxScore: 10,
    status: 'completed',
    locked: false,
    actionLabel: 'दुबारा करें',
  },
  {
    id: 3,
    titleHi: 'अभ्यास पत्र 3: परिवार',
    titleEn: 'Family',
    score: null,
    maxScore: 10,
    status: 'not_started',
    locked: false,
    actionLabel: 'शुरू करें',
  },
  {
    id: 4,
    titleHi: 'अभ्यास पत्र 4: संख्याएँ',
    titleEn: 'Numbers',
    score: null,
    maxScore: 10,
    status: 'not_started',
    locked: true,
    actionLabel: 'लॉक है',
  },
  {
    id: 5,
    titleHi: 'अभ्यास पत्र 5: दैनिक दिनचर्या',
    titleEn: 'Routine',
    score: null,
    maxScore: 10,
    status: 'not_started',
    locked: true,
    actionLabel: 'लॉक है',
  },
];

function getNextUnlockedModule() {
  return PRACTICE_MODULES.find((m) => !m.locked && m.status === 'not_started') ?? PRACTICE_MODULES.find((m) => !m.locked);
}

export default function PracticeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const nextModule = getNextUnlockedModule();

  const openPractice = (module) => {
    if (module.locked) return;
    navigation.navigate('Home', {
      screen: 'LessonPractice',
      params: {
        practiceSheetId: module.id,
        lesson: { id: 'practice-' + module.id },
        course: { lessons: [] },
        videoCompletedOnce: false,
      },
    });
  };

  const handleStartNext = () => {
    if (nextModule) openPractice(nextModule);
  };

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: '#F5F0F8', paddingTop: insets.top }}
    >
      <Text className="font-hindi text-center text-xl font-bold text-black pt-4 pb-2">
        अभ्यास (Practice)
      </Text>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 100 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        {PRACTICE_MODULES.map((module) => {
          const isLocked = module.locked;
          const isCompleted = module.status === 'completed';
          const showScore = isCompleted && module.score != null;

          return (
            <View
              key={module.id}
              className="mb-4 overflow-hidden rounded-2xl bg-white px-4 py-4"
              style={cardShadow}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1 min-w-0 mr-3">
                  <Text className="font-hindi text-body font-bold text-gray-900" numberOfLines={2}>
                    {module.titleHi}
                  </Text>
                  <Text className="font-hindi mt-0.5 text-rest text-gray-700">
                    ({module.titleEn})
                  </Text>
                  <View className="mt-2 flex-row items-center">
                    {showScore ? (
                      <>
                        <Icon name="check" size={18} color={GREEN} style={{ marginRight: 6 }} />
                        <Text className="font-openSans text-rest font-semibold" style={{ color: GREEN }}>
                          Score: {module.score}/{module.maxScore}
                        </Text>
                      </>
                    ) : (
                      <>
                        {isLocked && <Icon name="lock" size={16} color="#9CA3AF" style={{ marginRight: 6 }} />}
                        <Text className="font-hindi text-rest text-gray-400">
                          अभी शुरू नहीं किया
                        </Text>
                      </>
                    )}
                  </View>
                </View>
                <Pressable
                  onPress={() => openPractice(module)}
                  disabled={isLocked}
                  className={`rounded-xl px-4 py-2.5 ${isLocked ? 'bg-gray-200' : 'bg-button'}`}
                >
                  <Text
                    className={`font-hindi text-rest font-bold ${isLocked ? 'text-gray-600' : 'text-white'}`}
                  >
                    {module.actionLabel}
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom: Start next practice */}
      <View
        className="absolute left-0 right-0 bottom-0 px-4 pb-6 pt-4"
        style={{ paddingBottom: 24 + insets.bottom, backgroundColor: 'transparent' }}
      >
        <Pressable
          onPress={handleStartNext}
          className="flex-row items-center justify-center rounded-xl bg-button py-4"
          style={cardShadow}
        >
          <Text className="font-hindi text-body font-bold text-white">
            अगला अभ्यास शुरू करें
          </Text>
          <Icon name="lock" size={20} color="#fff" style={{ marginLeft: 8 }} />
        </Pressable>
      </View>
    </View>
  );
}

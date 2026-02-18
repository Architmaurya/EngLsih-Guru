import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { buttonShadow } from '../theme/shadows';

const PINK = '#EC4899';

const SAMPLE_QUESTIONS = [
  {
    id: '1',
    question: '"Good Morning" का हिंदी अर्थ क्या है?',
    options: [
      { id: 'a', text: 'शुभ प्रभात', correct: true },
      { id: 'b', text: 'शुभ रात्रि', correct: false },
      { id: 'c', text: 'नमस्ते', correct: false },
      { id: 'd', text: 'शुभ संध्या', correct: false },
    ],
  },
  {
    id: '2',
    question: '"Good Night" का हिंदी अर्थ क्या है?',
    options: [
      { id: 'a', text: 'शुभ प्रभात', correct: false },
      { id: 'b', text: 'शुभ रात्रि', correct: true },
      { id: 'c', text: 'नमस्ते', correct: false },
      { id: 'd', text: 'शुभ संध्या', correct: false },
    ],
  },
];

export default function LessonPracticeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { lesson, course, videoCompletedOnce = false } = route.params || {};

  const [questions] = useState(SAMPLE_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [answers, setAnswers] = useState([]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? (currentIndex + 1) / totalQuestions : 0;
  const hasSelection = selectedOptionId != null;
  const isLastQuestion = currentIndex >= totalQuestions - 1;

  const handleClose = () => navigation.goBack();

  const handleSelectOption = (optionId) => setSelectedOptionId(optionId);

  const handleNext = () => {
    if (!hasSelection) return;
    if (isLastQuestion) {
      const allAnswers = [...answers, selectedOptionId];
      const correctCount = questions.filter((q, i) => {
        const correctOpt = q.options.find((o) => o.correct);
        return correctOpt && allAnswers[i] === correctOpt.id;
      }).length;
      navigation.replace('LessonComplete', {
        lesson,
        course,
        correctCount,
        videoCompletedOnce,
      });
      return;
    }
    setAnswers((a) => [...a, selectedOptionId]);
    setCurrentIndex((i) => i + 1);
    setSelectedOptionId(null);
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-1 px-4 pt-3 pb-4">
        {/* Progress row */}
        <View className="mb-3 flex-row items-center">
          <Pressable
            onPress={handleClose}
            hitSlop={12}
            className="h-10 w-10 items-start justify-center"
          >
            <Icon name="x" size={24} color="#374151" />
          </Pressable>
          <View className="ml-2 flex-1">
            <View className="h-1.5 overflow-hidden rounded-[3px] bg-gray-100">
              <View
                className="absolute left-0 top-0 bottom-0 rounded-[3px] bg-button"
                style={{ width: `${progress * 100}%` }}
              />
            </View>
          </View>
          <Text className="ml-2.5 font-hindi text-rest font-semibold text-gray-800">
            {currentIndex + 1}/{totalQuestions}
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Question info row */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="font-hindi text-[15px] font-semibold text-gray-800">
              प्रश्न {currentIndex + 1}
            </Text>
            <View className="flex-row items-center rounded-full bg-button/10 px-3 py-1.5">
              <Icon name="gift" size={16} color={PINK} style={{ marginRight: 6 }} />
              <Text className="font-hindi text-xs font-semibold text-button">
                +5 पॉइंट्स मिलेंगे
              </Text>
            </View>
          </View>

          {/* Question text */}
          <Text className="font-hindi mb-6 text-lg font-bold leading-[26px] text-gray-800">
            {currentQuestion?.question}
          </Text>

          {/* Answer options */}
          <View className="gap-3">
            {currentQuestion?.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => handleSelectOption(option.id)}
                  className={`flex-row items-center justify-between rounded-xl border-2 py-4 px-4 ${
                    isSelected ? 'border-button bg-button/10' : 'border-gray-200 bg-white'
                  }`}
                >
                  <Text className="font-hindi flex-1 text-body font-medium text-gray-800">
                    {option.text}
                  </Text>
                  <View
                    className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                      isSelected ? 'border-button bg-button' : 'border-gray-200 bg-transparent'
                    }`}
                  >
                    {isSelected && <Icon name="check" size={14} color="#fff" />}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Bottom button */}
      <View
        className="bg-white px-4 pt-4"
        style={{ paddingBottom: 24 + insets.bottom }}
      >
        <Pressable
          onPress={handleNext}
          disabled={!hasSelection}
          className={`items-center justify-center rounded-xl py-4 ${
            hasSelection ? 'bg-button' : 'bg-gray-300'
          }`}
          style={hasSelection ? buttonShadow : undefined}
        >
          <Text
            className={`font-hindi text-body font-bold ${
              hasSelection ? 'text-white' : 'text-gray-400'
            }`}
          >
            {isLastQuestion ? 'पूर्ण करें' : 'अगला प्रश्न (Next Question)'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

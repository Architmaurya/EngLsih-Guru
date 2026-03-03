import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { buttonShadow } from '../../../../theme/shadows';
import { getMCQsByTopic, getMCQs, getMCQ, submitMCQ } from '../../../../services/mcqs/mcqsService';
import { recordProgress } from '../../../../services/progress/progressService';
import { updateUserStats } from '../../../../services/users/userStatsService';

const PINK = '#EC4899';

function mapMCQToQuestions(mcq) {
  const qs = mcq?.questions || [];
  return qs.map((q, qi) => ({
    id: String(qi),
    question: q.questionText || '',
    options: (q.options || []).map((opt, oi) => ({
      id: String(oi),
      text: opt.text || '',
      correct: undefined,
    })),
  }));
}

export default function LessonPracticeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { lesson, course, videoCompletedOnce = false } = route.params || {};

  const [questions, setQuestions] = useState([]);
  const [mcqId, setMcqId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    let cancelled = false;
    if (!lesson?.id) {
      setError('कोई लेसन नहीं चुना गया');
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      setError(null);
      try {
        let mcqList = await getMCQsByTopic(lesson.id);
        if (cancelled) return;
        if (!mcqList?.length) {
          mcqList = await getMCQs({ limit: 20 });
          if (cancelled) return;
        }
        const firstMcq = mcqList?.[0];
        if (firstMcq?._id) {
          const mcq = await getMCQ(firstMcq._id);
          if (cancelled) return;
          const mapped = mapMCQToQuestions(mcq);
          if (mapped.length > 0) {
            setQuestions(mapped);
            setMcqId(mcq._id);
          } else {
            setError('इस टॉपिक के लिए अभी कोई प्रश्न उपलब्ध नहीं हैं');
          }
        } else {
          setError('इस टॉपिक के लिए अभी कोई प्रश्न उपलब्ध नहीं हैं');
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || 'प्रश्न लोड नहीं हो सके');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [lesson?.id]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? (currentIndex + 1) / totalQuestions : 0;
  const hasSelection = selectedOptionId != null;
  const isLastQuestion = currentIndex >= totalQuestions - 1;

  const handleClose = () => navigation.goBack();

  const handleSelectOption = (optionId) => setSelectedOptionId(optionId);

  const handleNext = async () => {
    if (!hasSelection) return;
    if (isLastQuestion) {
      const allAnswers = [...answers, selectedOptionId];
      if (mcqId) {
        setSubmitLoading(true);
        try {
          const submitPayload = {
            answers: allAnswers.map((optionId, questionIndex) => ({
              questionIndex,
              selectedOption: parseInt(optionId, 10),
              timeSpent: 0,
            })),
          };
          const result = await submitMCQ(mcqId, submitPayload);
          const correctCount = result?.correctAnswers ?? 0;
          recordProgress({
            contentId: lesson.id,
            contentType: 'mcq',
            progressPercentage: 100,
            status: 'completed',
          }).catch(() => {});
          updateUserStats('test_passed', {
            contentId: lesson.id,
            contentType: 'mcq',
            score: result?.score,
          }).catch(() => {});
          navigation.replace('LessonComplete', {
            lesson,
            course,
            correctCount,
            videoCompletedOnce,
          });
        } catch (e) {
          setError(e?.message || 'Submit failed');
        } finally {
          setSubmitLoading(false);
        }
        return;
      }
    }
    setAnswers((a) => [...a, selectedOptionId]);
    setCurrentIndex((i) => i + 1);
    setSelectedOptionId(null);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center" style={{ paddingTop: insets.top }}>
        <ActivityIndicator size="large" color={PINK} />
        <Text className="font-hindi mt-3 text-body text-gray-600">प्रश्न लोड हो रहे हैं...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View className="flex-1 bg-white px-4 justify-center" style={{ paddingTop: insets.top }}>
        <Text className="font-hindi text-center text-body text-gray-600">
          {error || 'इस टॉपिक के लिए अभी कोई प्रश्न उपलब्ध नहीं हैं'}
        </Text>
        <Pressable
          onPress={handleClose}
          className="mt-6 self-center rounded-xl bg-button px-6 py-3"
          style={buttonShadow}
        >
          <Text className="font-hindi text-body font-bold text-white">वापस जाएं</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-1 px-4 pt-3 pb-4">
        <View className="mb-3 flex-row items-center">
          <Pressable
            onPress={handleClose}
            hitSlop={12}
            className="h-10 w-10 items-start justify-center"
            disabled={submitLoading}
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

        {error ? (
          <Text className="font-hindi mb-2 text-rest text-amber-600">{error}</Text>
        ) : null}

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
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

          <Text className="font-hindi mb-6 text-lg font-bold leading-[26px] text-gray-800">
            {currentQuestion?.question}
          </Text>

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

      <View
        className="bg-white px-4 pt-4"
        style={{ paddingBottom: 24 + insets.bottom }}
      >
        <Pressable
          onPress={handleNext}
          disabled={!hasSelection || submitLoading}
          className={`items-center justify-center rounded-xl py-4 ${
            hasSelection && !submitLoading ? 'bg-button' : 'bg-gray-300'
          }`}
          style={hasSelection && !submitLoading ? buttonShadow : undefined}
        >
          {submitLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text
              className={`font-hindi text-body font-bold ${
                hasSelection ? 'text-white' : 'text-gray-400'
              }`}
            >
              {isLastQuestion ? 'पूर्ण करें' : 'अगला प्रश्न (Next Question)'}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

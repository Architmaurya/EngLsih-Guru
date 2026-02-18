import React, { Component, useRef, useState, useEffect } from 'react';
import {
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Video from 'react-native-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { wasVideoPointsAwarded, setVideoPointsAwarded } from '../utils/videoPointsStore';

const PINK = '#EC4899';
const LIGHT_PINK_BORDER = '#F9A8D4';

const VIDEO_ASPECT_RATIO = 16 / 9;

// Local demo video used when lesson.videoUrl is not set (all lessons use this by default)
const FALLBACK_VIDEO = require('../../assets/lesson/V.mp4');

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Catches RCTVideo not found / native module errors and calls onError so we can show fallback */
class VideoErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.props.fallback) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function LessonScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const lesson = route.params?.lesson;
  const course = route.params?.course;

  const videoRef = useRef(null);
  const fullscreenVideoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [videoNativeError, setVideoNativeError] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [exitFullscreenSeekTo, setExitFullscreenSeekTo] = useState(null);
  const [muted, setMuted] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const hideControlsTimerRef = useRef(null);
  const HIDE_CONTROLS_AFTER_MS = 3000;
  const FADE_DURATION_MS = 600;

  if (!lesson || !course) {
    return (
      <View className="flex-1 items-center justify-center bg-white" style={{ paddingTop: insets.top }}>
        <Text className="font-openSans text-body text-gray-600">No lesson selected.</Text>
        <Pressable
          onPress={() => navigation.goBack()}
          className="mt-4 rounded-xl bg-button px-6 py-2"
        >
          <Text className="font-hindi text-body font-bold text-white">वापस जाएं</Text>
        </Pressable>
      </View>
    );
  }

  const videoSource = lesson.videoUrl ? { uri: lesson.videoUrl } : FALLBACK_VIDEO;
  const title = lesson.titleEn
    ? `${lesson.title} (${lesson.titleEn})`
    : lesson.title;

  const handleBack = () => navigation.goBack();

  const handlePlayPress = () => {
    if (videoNativeError) return;
    setVideoError(null);
    setIsPlaying(true);
    setPaused(false);
  };

  const handleVideoNativeError = () => {
    setVideoNativeError(true);
    setIsPlaying(false);
  };

  const handleVideoEnd = () => {
    setPaused(true);
    if (!wasVideoPointsAwarded(lesson.id)) {
      setVideoPointsAwarded(lesson.id);
    }
    setShowCompletionModal(true);
  };

  const handleVideoLoad = (e) => {
    const payload = e?.nativeEvent ?? e;
    const d = payload?.duration ?? 0;
    setDuration(d);
    if (exitFullscreenSeekTo != null && videoRef.current) {
      videoRef.current.seek(exitFullscreenSeekTo);
      setExitFullscreenSeekTo(null);
    }
  };

  const handleVideoProgress = (e) => {
    const payload = e?.nativeEvent ?? e;
    const t = payload?.currentTime ?? 0;
    setCurrentTime(t);
  };

  const activeVideoRef = fullscreen ? fullscreenVideoRef : videoRef;

  const handleSeekBack = () => {
    if (activeVideoRef.current) {
      const t = Math.max(0, currentTime - 10);
      activeVideoRef.current.seek(t);
      setCurrentTime(t);
    }
  };

  const handleSeekForward = () => {
    if (activeVideoRef.current) {
      const t = Math.min(duration, currentTime + 10);
      activeVideoRef.current.seek(t);
      setCurrentTime(t);
    }
  };

  const handleFullscreen = () => setFullscreen(true);

  const handleExitFullscreen = () => {
    setExitFullscreenSeekTo(currentTime);
    setFullscreen(false);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isAtEnd = duration > 0 && currentTime >= duration - 0.5;

  const handlePlayPauseToggle = () => {
    if (paused) {
      if (isAtEnd && activeVideoRef.current) {
        activeVideoRef.current.seek(0);
        setCurrentTime(0);
      }
      setPaused(false);
    } else {
      setPaused(true);
    }
  };

  const handleVolumePress = () => setMuted((m) => !m);

  const showControlsAndScheduleHide = () => {
    setControlsVisible(true);
    Animated.timing(controlsOpacity, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    hideControlsTimerRef.current = setTimeout(() => {
      hideControlsTimerRef.current = null;
      setControlsVisible(false);
      Animated.timing(controlsOpacity, { toValue: 0, duration: FADE_DURATION_MS, useNativeDriver: true }).start();
    }, HIDE_CONTROLS_AFTER_MS);
  };

  useEffect(() => {
    if (isPlaying) showControlsAndScheduleHide();
    return () => {
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    };
  }, [isPlaying]);

  useEffect(() => () => {
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
  }, []);

  const handleNextLesson = () => {
    setShowCompletionModal(false);
    navigation.navigate('CourseDetail', { course });
  };

  const handlePractice = () => {
    setShowCompletionModal(false);
    navigation.navigate('LessonPractice', {
      lesson,
      course,
      videoCompletedOnce: wasVideoPointsAwarded(lesson.id),
    });
  };

  const closeModal = () => setShowCompletionModal(false);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: back + title */}
        <View className="flex-row items-center border-b border-gray-100 px-4 pb-3 pt-2">
          <Pressable
            onPress={handleBack}
            className="mr-3 h-10 w-10 items-center justify-center rounded-full"
          >
            <Icon name="chevron-left" size={24} color="#1f2937" />
          </Pressable>
          <Text
            className="flex-1 font-hindi text-body font-bold text-gray-900"
            numberOfLines={2}
          >
            {title}
          </Text>
        </View>

        {/* Video section – 16:9, full width, dark overlay, modern player UI */}
        <View
          style={{
            width: '100%',
            aspectRatio: VIDEO_ASPECT_RATIO,
            position: 'relative',
            backgroundColor: '#000',
          }}
        >
          {!isPlaying || videoNativeError ? (
            <>
              {course.image && (
                <Image
                  source={course.image}
                  style={{ position: 'absolute', width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              )}
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.4)',
                }}
              />
              {videoError ? (
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 16,
                  }}
                >
                  <Text className="font-openSans text-rest text-white text-center">
                    {videoError}
                  </Text>
                  <Pressable
                    onPress={() => setVideoError(null)}
                    className="mt-2 rounded-xl px-4 py-2"
                    style={{ backgroundColor: PINK }}
                  >
                    <Text className="font-hindi text-rest font-bold text-white">पुनः प्रयास करें</Text>
                  </Pressable>
                </View>
              ) : (
                <>
                  {/* Overlay: center pink play, left rewind 10, right forward 10, bottom bar */}
                  <Pressable
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={handlePlayPress}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
                      <Pressable
                        hitSlop={12}
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 28,
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <View style={{ alignItems: 'center' }}>
                          <Icon name="rotate-ccw" size={18} color="#333" />
                          <Text style={{ fontSize: 11, color: '#333', fontWeight: '700', marginTop: 1 }}>10</Text>
                        </View>
                      </Pressable>
                      <Pressable
                        onPress={handlePlayPress}
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: 36,
                          backgroundColor: PINK,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Icon name="play" size={36} color="#fff" />
                      </Pressable>
                      <Pressable
                        hitSlop={12}
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 28,
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <View style={{ alignItems: 'center' }}>
                          <Icon name="rotate-cw" size={18} color="#333" />
                          <Text style={{ fontSize: 11, color: '#333', fontWeight: '700', marginTop: 1 }}>10</Text>
                        </View>
                      </Pressable>
                    </View>
                  </Pressable>
                  <View
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                  >
                    <Text style={{ fontSize: 12, color: '#fff', marginRight: 8 }}>00:00 / 00:00</Text>
                    <View style={{ flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' }}>
                      <View style={{ width: '0%', height: '100%', backgroundColor: PINK, borderRadius: 2 }} />
                    </View>
                    <Pressable onPress={handleVolumePress} hitSlop={8} style={{ padding: 6, marginLeft: 4 }}>
                      <Icon name={muted ? 'volume-x' : 'volume-2'} size={20} color="#fff" />
                    </Pressable>
                    <Pressable onPress={handleFullscreen} hitSlop={8} style={{ padding: 6, marginLeft: 4 }}>
                      <Icon name="maximize-2" size={20} color="#fff" />
                    </Pressable>
                  </View>
                  {videoNativeError && (
                    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 48, paddingHorizontal: 16, alignItems: 'center' }}>
                      <Text className="font-openSans text-rest text-center text-white" style={{ textShadowColor: 'rgba(0,0,0,0.8)', textShadowRadius: 2 }}>
                        Video requires app rebuild.
                      </Text>
                    </View>
                  )}
                </>
              )}
            </>
          ) : fullscreen ? (
            /* Fullscreen modal: layout like reference – top back, center pink play + white 10s, bottom bar with scrubber, volume, fullscreen */
            <Modal
              visible={fullscreen}
              transparent
              animationType="fade"
              onRequestClose={handleExitFullscreen}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#000',
                  paddingTop: insets.top,
                  paddingBottom: insets.bottom,
                }}
              >
                <VideoErrorBoundary
                  onError={handleVideoNativeError}
                  fallback={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
                      <Text className="font-openSans text-rest text-white mb-3">Video error</Text>
                      <Pressable onPress={handleExitFullscreen} className="rounded-xl bg-white px-4 py-2">
                        <Text className="font-hindi text-rest font-bold text-gray-800">वापस</Text>
                      </Pressable>
                    </View>
                  }
                >
                  <View style={{ flex: 1, position: 'relative' }}>
                  <Video
                    ref={fullscreenVideoRef}
                    source={videoSource}
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: '100%',
                      height: '100%',
                    }}
                    resizeMode="contain"
                    paused={paused}
                    muted={muted}
                    onEnd={handleVideoEnd}
                    onLoad={(e) => {
                      const payload = e?.nativeEvent ?? e;
                      const d = payload?.duration ?? 0;
                      setDuration(d);
                      if (fullscreenVideoRef.current) {
                        fullscreenVideoRef.current.seek(currentTime);
                      }
                    }}
                    onProgress={handleVideoProgress}
                    onError={(e) => {
                      const err = e?.nativeEvent ?? e;
                      setVideoError(err?.error?.errorString ?? err?.error ?? 'Video could not be loaded');
                    }}
                  />
                  {/* Overlay: top back, center controls, bottom bar – tap to show controls, auto-hide with slow fade */}
                  <Pressable
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.25)',
                    }}
                    onPress={showControlsAndScheduleHide}
                  >
                    <Animated.View
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        opacity: controlsOpacity,
                      }}
                      pointerEvents={controlsVisible ? 'auto' : 'none'}
                    >
                    {/* Top left: back */}
                    <Pressable
                      onPress={handleExitFullscreen}
                      hitSlop={12}
                      style={{
                        position: 'absolute',
                        left: 16,
                        top: 12,
                        width: 40,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1,
                      }}
                    >
                      <Icon name="chevron-left" size={28} color="#fff" />
                    </Pressable>

                    {/* Center: rewind 10 | big pink play | forward 10 */}
                    <View
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: '50%',
                        marginTop: -40,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 24,
                      }}
                    >
                      <Pressable
                        onPress={handleSeekBack}
                        hitSlop={8}
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 28,
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <View style={{ alignItems: 'center' }}>
                          <Icon name="rotate-ccw" size={18} color="#333" />
                          <Text style={{ fontSize: 11, color: '#333', fontWeight: '700', marginTop: 1 }}>10</Text>
                        </View>
                      </Pressable>
                      <Pressable
                        onPress={handlePlayPauseToggle}
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: 36,
                          backgroundColor: PINK,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Icon name={paused ? 'play' : 'pause'} size={36} color="#fff" />
                      </Pressable>
                      <Pressable
                        onPress={handleSeekForward}
                        hitSlop={8}
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 28,
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <View style={{ alignItems: 'center' }}>
                          <Icon name="rotate-cw" size={18} color="#333" />
                          <Text style={{ fontSize: 11, color: '#333', fontWeight: '700', marginTop: 1 }}>10</Text>
                        </View>
                      </Pressable>
                    </View>

                    {/* Bottom bar: play/pause | time | progress + scrubber | volume | fullscreen exit */}
                    <View
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        paddingBottom: 12 + insets.bottom,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                      }}
                    >
                      <Pressable onPress={handlePlayPauseToggle} hitSlop={8} style={{ padding: 4 }}>
                        <Icon name={paused ? 'play' : 'pause'} size={22} color="#fff" />
                      </Pressable>
                      <Text className="font-openSans text-rest text-white ml-2">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </Text>
                      <View
                        style={{
                          flex: 1,
                          height: 4,
                          marginLeft: 12,
                          marginRight: 12,
                          backgroundColor: 'rgba(255,255,255,0.4)',
                          borderRadius: 2,
                          overflow: 'visible',
                          justifyContent: 'center',
                        }}
                      >
                        <View
                          style={{
                            position: 'absolute',
                            left: 0,
                            width: `${progressPercent}%`,
                            height: 4,
                            backgroundColor: PINK,
                            borderRadius: 2,
                          }}
                        />
                        <View
                          style={{
                            position: 'absolute',
                            left: `${Math.max(0, Math.min(100, progressPercent))}%`,
                            marginLeft: -6,
                            width: 12,
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                      <Pressable onPress={handleVolumePress} hitSlop={8} style={{ padding: 4 }}>
                        <Icon name={muted ? 'volume-x' : 'volume-2'} size={22} color="#fff" />
                      </Pressable>
                      <Pressable onPress={handleExitFullscreen} hitSlop={8} style={{ padding: 4, marginLeft: 4 }}>
                        <Icon name="minimize-2" size={22} color="#fff" />
                      </Pressable>
                    </View>
                    </Animated.View>
                  </Pressable>
                  </View>
                </VideoErrorBoundary>
              </View>
            </Modal>
          ) : (
            <>
              <VideoErrorBoundary
                onError={handleVideoNativeError}
                fallback={
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 16,
                      backgroundColor: 'rgba(0,0,0,0.6)',
                    }}
                  >
                    <Text className="font-openSans text-rest text-center text-white mb-3">
                      Video module not linked. Rebuild the app (iOS: pod install, then run).
                    </Text>
                    <Pressable onPress={handleVideoNativeError} className="rounded-xl bg-white px-4 py-2">
                      <Text className="font-hindi text-rest font-bold text-gray-800">ठीक है</Text>
                    </Pressable>
                  </View>
                }
              >
              <Video
                ref={videoRef}
                source={videoSource}
                style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, width: '100%', height: '100%' }}
                resizeMode="contain"
                paused={paused}
                muted={muted}
                onEnd={handleVideoEnd}
                onLoad={handleVideoLoad}
                onProgress={handleVideoProgress}
                onError={(e) => {
                  const err = e?.nativeEvent ?? e;
                  setVideoError(err?.error?.errorString ?? err?.error ?? 'Video could not be loaded');
                }}
              />
              {/* Overlay: center pink play/pause, left rewind 10, right forward 10, bottom bar – tap to show controls, auto-hide with slow fade */}
              <Pressable
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.25)',
                }}
                onPress={showControlsAndScheduleHide}
              >
                <Animated.View
                  style={{
                    flex: 1,
                    opacity: controlsOpacity,
                  }}
                  pointerEvents={controlsVisible ? 'auto' : 'none'}
                >
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 24,
                  }}
                >
                  <Pressable
                    onPress={handleSeekBack}
                    hitSlop={12}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <View style={{ alignItems: 'center' }}>
                      <Icon name="rotate-ccw" size={18} color="#333" />
                      <Text style={{ fontSize: 11, color: '#333', fontWeight: '700', marginTop: 1 }}>10</Text>
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={handlePlayPauseToggle}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 36,
                      backgroundColor: PINK,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Icon name={paused ? 'play' : 'pause'} size={36} color="#fff" />
                  </Pressable>
                  <Pressable
                    onPress={handleSeekForward}
                    hitSlop={12}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <View style={{ alignItems: 'center' }}>
                      <Icon name="rotate-cw" size={18} color="#333" />
                      <Text style={{ fontSize: 11, color: '#333', fontWeight: '700', marginTop: 1 }}>10</Text>
                    </View>
                  </Pressable>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}
                >
                  <Text style={{ fontSize: 12, color: '#fff', marginRight: 10 }}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      height: 4,
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <View
                      style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        backgroundColor: PINK,
                        borderRadius: 2,
                      }}
                    />
                  </View>
                  <Pressable onPress={handleVolumePress} hitSlop={8} style={{ padding: 6, marginLeft: 8 }}>
                    <Icon name={muted ? 'volume-x' : 'volume-2'} size={20} color="#fff" />
                  </Pressable>
                  <Pressable onPress={handleFullscreen} hitSlop={8} style={{ padding: 6, marginLeft: 4 }}>
                    <Icon name="maximize-2" size={20} color="#fff" />
                  </Pressable>
                </View>
                </Animated.View>
              </Pressable>
              </VideoErrorBoundary>
            </>
          )}
        </View>

        {/* Reward box */}
        <View
          className="mx-4 mt-4 flex-row items-center rounded-xl px-4 py-3 bg-button/10"
        >
          <Icon name="gift" size={24} color={PINK} />
          <Text className="ml-3 flex-1 font-hindi text-rest font-bold text-button">
            विडियो देखने पर +5 पॉइंट्स मिलेंगे
          </Text>
        </View>

        {/* Next Step */}
        <View className="mt-6 px-4">
          <Text className="font-hindi text-heading font-bold text-gray-900">
            अगला कदम
          </Text>
        </View>

        {/* Practice card */}
        <View
          className="mx-4 mt-3 rounded-xl border-2 px-4 py-4"
          style={{ borderColor: LIGHT_PINK_BORDER }}
        >
          <View className="flex-row items-start justify-between">
            <Text className="font-hindi text-body font-bold text-gray-900">
              अभ्यास पत्र
            </Text>
            <View className="rounded-full px-4 py-2 bg-button/10">
              <Text className="font-hindi text-center text-button text-rest font-bold">
                10 पॉइंट्स
              </Text>
            </View>
          </View>
          <Text className="mt-2 font-openSans text-rest text-gray-600">
            इस पाठ से जुड़े 2 सवालों के जवाब दें।
          </Text>
          <Pressable
            className="mt-4 items-center justify-center bg-button rounded-xl py-3.5"
            onPress={handlePractice}
          >
            <Text className="font-hindi text-body font-bold text-white">
              शुरू करें (Start)
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Completion modal */}
      <Modal
        visible={showCompletionModal}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}
          onPress={closeModal}
        >
          <Pressable
            style={{
              width: '100%',
              maxWidth: 340,
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 24,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row justify-end">
              <Pressable onPress={closeModal} hitSlop={8} className="p-1">
                <Icon name="x" size={24} color="#6B7280" />
              </Pressable>
            </View>
            <Text
              className="font-hindi text-heading font-bold text-center mt-2"
              style={{ color: PINK }}
            >
              +5 अंक
            </Text>
            <Text className="font-hindi text-body text-gray-700 text-center mt-3 px-2">
              यह वीडियो आपने पूरा कर लिया अब अभ्यास करने के लिए आगे बढ़ें
            </Text>
            <View className="flex-row gap-3 mt-6">
              <Pressable
                className="flex-1 items-center justify-center rounded-xl py-3.5 bg-gray-200"
                onPress={handleNextLesson}
              >
                <Text className="font-hindi text-body font-bold text-gray-800">
                  अगला पाठ
                </Text>
              </Pressable>
              <Pressable
                className="flex-1 items-center justify-center rounded-xl py-3.5"
                style={{ backgroundColor: PINK }}
                onPress={handlePractice}
              >
                <Text className="font-hindi text-body font-bold text-white">
                  अभ्यास
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

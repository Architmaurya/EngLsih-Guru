/**
 * Tracks which lessons have already been awarded +5 video completion points.
 * Award only once per lesson (even if user replays the video).
 * In-memory; for persistence across app restarts, use AsyncStorage.
 */
const videoPointsAwarded = {};

export function wasVideoPointsAwarded(lessonId) {
  return !!videoPointsAwarded[lessonId];
}

export function setVideoPointsAwarded(lessonId) {
  videoPointsAwarded[lessonId] = true;
}

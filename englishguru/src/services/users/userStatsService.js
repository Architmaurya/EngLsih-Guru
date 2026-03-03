import api from '../api/apiClient';
import { USER_STATS_DETAILED, USER_STATS_UPDATE } from '../api/endpoints';

/**
 * GET /api/users/stats/detailed - user stats including streak, points (Bearer).
 * Returns: currentStreak, longestStreak, videosWatched, completedVideos, points (if backend includes it), etc.
 */
export async function getDetailedUserStats() {
  const res = await api.get(USER_STATS_DETAILED);
  const data = res?.data;
  if (!data?.success) throw new Error(data?.message || 'Failed to fetch user stats');
  return data.data || {};
}

/**
 * POST /api/users/stats/update - record activity to earn (streak, points).
 * activityType: video_watched | content_completed | test_passed | login | favorite_added | bookmark_added | comment_posted | share_created
 * contentId (optional): MongoDB ObjectId, contentType (optional): video | text | mcq | questionnaire
 */
export async function updateUserStats(activityType, payload = {}) {
  const body = { activityType, ...payload };
  const res = await api.post(USER_STATS_UPDATE, body);
  const data = res?.data;
  if (!data?.success) {
    throw new Error(data?.message || 'Failed to update stats');
  }
  return data.data || {};
}

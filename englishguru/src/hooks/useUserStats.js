import { useState, useEffect, useCallback } from 'react';
import { getDetailedUserStats } from '../services/users/userStatsService';

/**
 * Fetches GET /api/users/stats/detailed (Bearer) and exposes streak, points, and full stats.
 * Use across CoursesScreen, ProfileScreen, LessonCompleteScreen, etc.
 * @returns {{ streakDays: number, totalPoints: number, stats: object, loading: boolean, error: string|null, refresh: function }}
 */
export function useUserStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDetailedUserStats();
      setStats(data);
    } catch (e) {
      setError(e?.message || 'Failed to load stats');
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const streakDays = stats?.currentStreak ?? 0;
  // When backend returns counts, scale for display: 1 activity (video or test) = 5 points
  const POINTS_DISPLAY_MULTIPLIER = 5;
  const rawCount =
    (Number(stats?.videosWatched) || 0) + (Number(stats?.testsCompleted) || 0) || Number(stats?.completedVideos) || 0;
  const totalPoints =
    typeof stats?.points === 'number'
      ? Math.max(0, Math.floor(stats.points))
      : Math.max(0, Math.floor(rawCount * POINTS_DISPLAY_MULTIPLIER));

  return {
    streakDays,
    totalPoints,
    stats: stats || {},
    loading,
    error,
    refresh: fetchStats,
  };
}

import api from '../api/apiClient';
import { videoView, videoProgress } from '../api/endpoints';

/**
 * POST /api/videos/:id/view - record video view (optionalAuth).
 */
export async function recordVideoView(videoId) {
  console.log('[videosService] recordVideoView (earn)', { videoId });
  const res = await api.post(videoView(videoId));
  const data = res?.data;
  if (!data?.success) {
    console.log('[videosService] recordVideoView failed', { status: res?.status, message: data?.message });
    throw new Error(data?.message || 'Failed to record view');
  }
  console.log('[videosService] recordVideoView success');
  return data.data || {};
}

/**
 * POST /api/videos/:id/progress - record video watch progress (Bearer).
 * Body: progress, duration, completed, deviceType
 */
export async function recordVideoProgress(videoId, body = {}) {
  console.log('[videosService] recordVideoProgress (earn)', { videoId, completed: body.completed, progress: body.progress });
  const res = await api.post(videoProgress(videoId), body);
  const data = res?.data;
  if (!data?.success) {
    console.log('[videosService] recordVideoProgress failed', { status: res?.status, message: data?.message });
    throw new Error(data?.message || 'Failed to record progress');
  }
  console.log('[videosService] recordVideoProgress success');
  return data.data || {};
}

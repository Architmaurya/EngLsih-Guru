import api from '../api/apiClient';
import { PROGRESS_RECORD } from '../api/endpoints';

/**
 * POST /api/progress/record - record content progress (video, text, mcq, questionnaire).
 * contentId (required): MongoDB ObjectId, contentType (required): video | text | mcq | questionnaire
 * progressPercentage (optional): 0-100, timeSpent (optional): seconds, status (optional): notStarted | inProgress | completed
 */
export async function recordProgress(payload) {
  const { contentId, contentType, progressPercentage = 0, timeSpent = 0, status = 'inProgress', metadata } = payload;
  const body = { contentId, contentType, progressPercentage, timeSpent, status };
  if (metadata != null) body.metadata = metadata;
  console.log('[progressService] recordProgress (earn)', { contentId, contentType, progressPercentage, timeSpent, status });
  const res = await api.post(PROGRESS_RECORD, body);
  const data = res?.data;
  if (!data?.success) {
    console.log('[progressService] recordProgress failed', { status: res?.status, message: data?.message });
    throw new Error(data?.message || 'Failed to record progress');
  }
  console.log('[progressService] recordProgress success');
  return data.data || {};
}

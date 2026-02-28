import api from '../api/apiClient';
import { MCQS, mcqById, mcqSubmit } from '../api/endpoints';

/**
 * GET /api/mcqs - list MCQs (package-scoped). Params: page, limit, topic, search, difficulty, sort.
 */
export async function getMCQs(params = {}) {
  console.log('[mcqsService] getMCQs request', { endpoint: MCQS, params });
  const res = await api.get(MCQS, { params });
  const data = res?.data;
  if (!data?.success) {
    console.log('[mcqsService] getMCQs failed', { status: res?.status, message: data?.message });
    throw new Error(data?.message || 'Failed to fetch MCQs');
  }
  const list = data.data || [];
  console.log('[mcqsService] getMCQs success', { count: list.length, ids: list.map((m) => m._id) });
  return list;
}

/**
 * GET /api/mcqs?topic=<topicId> - list MCQs for a topic (package-scoped).
 */
export async function getMCQsByTopic(topicId, params = {}) {
  const requestParams = { ...params, topic: topicId };
  console.log('[mcqsService] getMCQsByTopic request', { topicId, endpoint: MCQS, params: requestParams });
  const res = await api.get(MCQS, { params: requestParams });
  const data = res?.data;
  if (!data?.success) {
    console.log('[mcqsService] getMCQsByTopic failed', { topicId, status: res?.status, message: data?.message });
    throw new Error(data?.message || 'Failed to fetch MCQs for topic');
  }
  const list = data.data || [];
  console.log('[mcqsService] getMCQsByTopic success', { topicId, count: list.length, ids: list.map((m) => m._id) });
  return list;
}

/**
 * GET /api/mcqs/:id - single MCQ with questions (options; correct answers hidden by API).
 */
export async function getMCQ(id) {
  console.log('[mcqsService] getMCQ request', { id, endpoint: mcqById(id) });
  const res = await api.get(mcqById(id));
  const data = res?.data;
  if (!data?.success) {
    console.log('[mcqsService] getMCQ failed', { id, status: res?.status, message: data?.message });
    throw new Error(data?.message || 'MCQ not found');
  }
  const mcq = data.data;
  const qCount = mcq?.questions?.length ?? 0;
  console.log('[mcqsService] getMCQ success', { id: mcq?._id, title: mcq?.title, questionsCount: qCount });
  return mcq;
}

/**
 * POST /api/mcqs/:id/submit - submit MCQ answers (Bearer).
 * answers: [{ questionIndex: number, selectedOption: number (0-3), timeSpent?: number }]
 * Returns { score, correctAnswers, totalQuestions, passed, submissionId, feedback }.
 */
export async function submitMCQ(id, payload) {
  console.log('[mcqsService] submitMCQ request', { id, endpoint: mcqSubmit(id), answersCount: payload?.answers?.length });
  const res = await api.post(mcqSubmit(id), payload);
  const data = res?.data;
  if (!data?.success) {
    console.log('[mcqsService] submitMCQ failed', { id, status: res?.status, message: data?.message });
    throw new Error(data?.message || 'Failed to submit MCQ');
  }
  const result = data.data || {};
  console.log('[mcqsService] submitMCQ success', { id, score: result.score, correctAnswers: result.correctAnswers, totalQuestions: result.totalQuestions });
  return result;
}

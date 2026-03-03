import api from '../api/apiClient';
import { MCQS, mcqById, mcqSubmit } from '../api/endpoints';

/**
 * GET /api/mcqs - list MCQs (package-scoped). Params: page, limit, topic, search, difficulty, sort.
 */
export async function getMCQs(params = {}) {
  const res = await api.get(MCQS, { params });
  const data = res?.data;
  if (!data?.success) {
    throw new Error(data?.message || 'Failed to fetch MCQs');
  }
  const list = data.data || [];
  return list;
}

/**
 * GET /api/mcqs?topic=<topicId> - list MCQs for a topic (package-scoped).
 */
export async function getMCQsByTopic(topicId, params = {}) {
  const requestParams = { ...params, topic: topicId };
  const res = await api.get(MCQS, { params: requestParams });
  const data = res?.data;
  if (!data?.success) {
    throw new Error(data?.message || 'Failed to fetch MCQs for topic');
  }
  const list = data.data || [];
  return list;
}

/**
 * GET /api/mcqs/:id - single MCQ with questions (options; correct answers hidden by API).
 */
export async function getMCQ(id) {
  const res = await api.get(mcqById(id));
  const data = res?.data;
  if (!data?.success) {
    throw new Error(data?.message || 'MCQ not found');
  }
  const mcq = data.data;
  return mcq;
}

/**
 * POST /api/mcqs/:id/submit - submit MCQ answers (Bearer).
 * answers: [{ questionIndex: number, selectedOption: number (0-3), timeSpent?: number }]
 * Returns { score, correctAnswers, totalQuestions, passed, submissionId, feedback }.
 */
export async function submitMCQ(id, payload) {
  const res = await api.post(mcqSubmit(id), payload);
  const data = res?.data;
  if (!data?.success) {
    throw new Error(data?.message || 'Failed to submit MCQ');
  }
  const result = data.data || {};
  return result;
}

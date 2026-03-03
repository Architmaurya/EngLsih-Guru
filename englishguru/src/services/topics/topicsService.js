import api from '../api/apiClient';
import { TOPICS, topicById, topicVideos, topicRelated } from '../api/endpoints';

/**
 * GET /api/topics - list topics (package-scoped).
 * Query: page, limit, search, category, difficulty, isPremium, sort
 */
export async function getTopics(params = {}) {
  const res = await api.get(TOPICS, { params });
  const data = res?.data;
  if (!data?.success) {
    throw new Error(data?.message || 'Failed to fetch topics');
  }
  const list = data.data || [];
  return { data: list, pagination: data.pagination };
}

/**
 * GET /api/topics/:id - single topic
 */
export async function getTopic(id) {
  const res = await api.get(topicById(id));
  const data = res?.data;
  if (!data?.success) {
    throw new Error(data?.message || 'Topic not found');
  }
  const topic = data.data;
  return topic;
}

/**
 * GET /api/topics/:id/videos - videos in topic
 * Query: page, limit
 */
export async function getTopicVideos(id, params = {}) {
  const res = await api.get(topicVideos(id), { params });
  const data = res?.data;
  if (!data?.success) {
    throw new Error(data?.message || 'Failed to fetch videos');
  }
  const list = data.data || [];
  return { data: list, pagination: data.pagination };
}

/**
 * GET /api/topics/:id/related - related topics
 */
export async function getRelatedTopics(id) {
  const res = await api.get(topicRelated(id));
  const data = res?.data;
  if (!data?.success) {
    throw new Error(data?.message || 'Failed to fetch related topics');
  }
  const list = data.data || [];
  return list;
}

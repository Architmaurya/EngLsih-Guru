import api from '../api/apiClient';
import { TOPICS, topicById, topicVideos, topicRelated } from '../api/endpoints';

/**
 * GET /api/topics - list topics (package-scoped).
 * Query: page, limit, search, category, difficulty, isPremium, sort
 */
export async function getTopics(params = {}) {
  console.log('[topicsService] getTopics request', { endpoint: TOPICS, params });
  const res = await api.get(TOPICS, { params });
  const data = res?.data;
  if (!data?.success) {
    console.log('[topicsService] getTopics failed', { status: res?.status, message: data?.message });
    throw new Error(data?.message || 'Failed to fetch topics');
  }
  const list = data.data || [];
  console.log('[topicsService] getTopics success', { count: list.length, pagination: data.pagination, titles: list.map((t) => t.title) });
  return { data: list, pagination: data.pagination };
}

/**
 * GET /api/topics/:id - single topic
 */
export async function getTopic(id) {
  console.log('[topicsService] getTopic request', { id, endpoint: topicById(id) });
  const res = await api.get(topicById(id));
  const data = res?.data;
  if (!data?.success) {
    console.log('[topicsService] getTopic failed', { id, status: res?.status, message: data?.message });
    throw new Error(data?.message || 'Topic not found');
  }
  const topic = data.data;
  console.log('[topicsService] getTopic success', { id: topic?._id, title: topic?.title, videosCount: topic?.videos?.length });
  return topic;
}

/**
 * GET /api/topics/:id/videos - videos in topic
 * Query: page, limit
 */
export async function getTopicVideos(id, params = {}) {
  console.log('[topicsService] getTopicVideos request', { topicId: id, endpoint: topicVideos(id), params });
  const res = await api.get(topicVideos(id), { params });
  const data = res?.data;
  if (!data?.success) {
    console.log('[topicsService] getTopicVideos failed', { id, status: res?.status, message: data?.message });
    throw new Error(data?.message || 'Failed to fetch videos');
  }
  const list = data.data || [];
  console.log('[topicsService] getTopicVideos success', { topicId: id, count: list.length, pagination: data.pagination });
  return { data: list, pagination: data.pagination };
}

/**
 * GET /api/topics/:id/related - related topics
 */
export async function getRelatedTopics(id) {
  console.log('[topicsService] getRelatedTopics request', { topicId: id, endpoint: topicRelated(id) });
  const res = await api.get(topicRelated(id));
  const data = res?.data;
  if (!data?.success) {
    console.log('[topicsService] getRelatedTopics failed', { id, status: res?.status, message: data?.message });
    throw new Error(data?.message || 'Failed to fetch related topics');
  }
  const list = data.data || [];
  console.log('[topicsService] getRelatedTopics success', { topicId: id, relatedCount: list.length });
  return list;
}

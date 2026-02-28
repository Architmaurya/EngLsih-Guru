import api from '../api/apiClient';
import {
  CATEGORIES,
  categoryById,
  categoryComplete,
  categoryTopics,
} from '../api/endpoints';

/**
 * GET /api/categories - list categories (package-scoped).
 * Query: page, limit, search, sort (order|name|newest|popular)
 */
export async function getCategories(params = {}) {
  console.log('[categoriesService] getCategories request', { endpoint: CATEGORIES, params });
  const res = await api.get(CATEGORIES, { params });
  const data = res?.data;
  if (!data?.success) {
    console.log('[categoriesService] getCategories failed', { status: res?.status, message: data?.message });
    throw new Error(data?.message || 'Failed to fetch categories');
  }
  const list = data.data || [];
  console.log('[categoriesService] getCategories success', {
    count: list.length,
    pagination: data.pagination,
    ids: list.map((c) => c._id || c.id),
    names: list.map((c) => c.name),
    thumbnails: list.map((c) => c.thumbnail),
    icons: list.map((c) => c.icon),
  });
  return { data: list, pagination: data.pagination };
}

/**
 * GET /api/categories/:id - single category
 */
export async function getCategory(id) {
  console.log('[categoriesService] getCategory request', { id, endpoint: categoryById(id) });
  const res = await api.get(categoryById(id));
  const data = res?.data;
  if (!data?.success) {
    console.log('[categoriesService] getCategory failed', { id, status: res?.status, message: data?.message });
    throw new Error(data?.message || 'Category not found');
  }
  const category = data.data;
  console.log('[categoriesService] getCategory success', {
    id: category?._id || category?.id,
    name: category?.name,
    topicsCount: category?.topics?.length,
  });
  return category;
}

/**
 * GET /api/categories/:id/complete - category with topics, videos, stats
 */
export async function getCategoryComplete(id) {
  console.log('[categoriesService] getCategoryComplete request', { id, endpoint: categoryComplete(id) });
  const res = await api.get(categoryComplete(id));
  const data = res?.data;
  if (!data?.success) {
    console.log('[categoriesService] getCategoryComplete failed', { id, status: res?.status, message: data?.message });
    throw new Error(data?.message || 'Category not found');
  }
  const result = data.data;
  const topics = result?.topics || [];
  const videos = result?.videos || [];
  console.log('[categoriesService] getCategoryComplete success', {
    categoryId: result?.category?._id || result?.category?.id,
    categoryName: result?.category?.name,
    topicsCount: topics.length,
    videosCount: videos.length,
    stats: result?.stats,
    topicTitles: topics.map((t) => t.title),
  });
  return result;
}

/**
 * GET /api/categories/:id/topics - topics in category
 * Query: page, limit, difficulty, sort
 */
export async function getCategoryTopics(id, params = {}) {
  console.log('[categoriesService] getCategoryTopics request', { id, endpoint: categoryTopics(id), params });
  const res = await api.get(categoryTopics(id), { params });
  const data = res?.data;
  if (!data?.success) {
    console.log('[categoriesService] getCategoryTopics failed', { id, status: res?.status, message: data?.message });
    throw new Error(data?.message || 'Failed to fetch topics');
  }
  const list = data.data || [];
  console.log('[categoriesService] getCategoryTopics success', {
    categoryId: id,
    count: list.length,
    pagination: data.pagination,
    topicIds: list.map((t) => t._id || t.id),
    topicTitles: list.map((t) => t.title),
  });
  return { data: list, pagination: data.pagination };
}

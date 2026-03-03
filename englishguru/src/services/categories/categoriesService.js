import api from '../api/apiClient';
import {
  CATEGORIES,
  categoryById,
  categoryTopics,
} from '../api/endpoints';

/**
 * GET /api/categories - list categories (package-scoped).
 * Query: page, limit, search, sort (order|name|newest|popular)
 */
export async function getCategories(params = {}) {
  const res = await api.get(CATEGORIES, { params });
  const data = res?.data;
  if (!data?.success) {
    throw new Error(data?.message || 'Failed to fetch categories');
  }
  const list = data.data || [];
  return { data: list, pagination: data.pagination };
}

/**
 * GET /api/categories/:id - single category
 */
export async function getCategory(id) {
  const res = await api.get(categoryById(id));
  const data = res?.data;
  if (!data?.success) {
    throw new Error(data?.message || 'Category not found');
  }
  const category = data.data;
  return category;
}

/**
 * GET /api/categories/:id/topics - topics in category
 * Query: page, limit, difficulty, sort
 */
export async function getCategoryTopics(id, params = {}) {
  const res = await api.get(categoryTopics(id), { params });
  const data = res?.data;
  if (!data?.success) {
    throw new Error(data?.message || 'Failed to fetch topics');
  }
  const list = data.data || [];
  return { data: list, pagination: data.pagination };
}

import api from '../api/apiClient';
import { LEARNING_MODULES, learningModuleById } from '../api/endpoints';

/**
 * GET /api/learning-modules - list learning modules (package-scoped).
 * Query: page, limit, search, topic, difficulty, isPremium, sort
 */
export async function getLearningModules(params = {}) {
  const res = await api.get(LEARNING_MODULES, { params });
  const data = res?.data;
  if (!data?.success) {
    throw new Error(data?.message || 'Failed to fetch learning modules');
  }
  const list = data.data || [];
  return { data: list, pagination: data.pagination, total: data.total };
}

/**
 * GET /api/learning-modules/:id - single learning module (with content)
 */
export async function getLearningModule(id) {
  const res = await api.get(learningModuleById(id));
  const data = res?.data;
  if (!data?.success) {
    throw new Error(data?.message || 'Learning module not found');
  }
  const mod = data.data;
  return mod;
}

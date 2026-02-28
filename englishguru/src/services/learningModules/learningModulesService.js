import api from '../api/apiClient';
import { LEARNING_MODULES, learningModuleById } from '../api/endpoints';

/**
 * GET /api/learning-modules - list learning modules (package-scoped).
 * Query: page, limit, search, topic, difficulty, isPremium, sort
 */
export async function getLearningModules(params = {}) {
  console.log('[learningModulesService] getLearningModules request', { endpoint: LEARNING_MODULES, params });
  const res = await api.get(LEARNING_MODULES, { params });
  const data = res?.data;
  if (!data?.success) {
    console.log('[learningModulesService] getLearningModules failed', { status: res?.status, message: data?.message });
    throw new Error(data?.message || 'Failed to fetch learning modules');
  }
  const list = data.data || [];
  console.log('[learningModulesService] getLearningModules success', {
    count: list.length,
    total: data.total,
    pagination: data.pagination,
    titles: list.map((m) => m.title),
  });
  return { data: list, pagination: data.pagination, total: data.total };
}

/**
 * GET /api/learning-modules/:id - single learning module (with content)
 */
export async function getLearningModule(id) {
  console.log('[learningModulesService] getLearningModule request', { id, endpoint: learningModuleById(id) });
  const res = await api.get(learningModuleById(id));
  const data = res?.data;
  if (!data?.success) {
    console.log('[learningModulesService] getLearningModule failed', { id, status: res?.status, message: data?.message });
    throw new Error(data?.message || 'Learning module not found');
  }
  const mod = data.data;
  const content = mod?.populatedContent || mod?.content || [];
  console.log('[learningModulesService] getLearningModule success', {
    id: mod?._id,
    title: mod?.title,
    contentCount: content.length,
    contentTypes: content.map((c) => c.contentType),
  });
  return mod;
}

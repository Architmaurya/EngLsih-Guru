import api from '../api/apiClient';
import { MODULES } from '../api/endpoints';

/**
 * GET /api/modules?class=X - modules for given class (1-5 for backend; English Guru may use 1-9).
 * Query: class (required), page, limit
 */
export async function getModulesByClass(classNumber, params = {}) {
  const query = { class: classNumber, ...params };
  const res = await api.get(MODULES, { params: query });
  const data = res?.data;
  if (!data?.success) {
    throw new Error(data?.message || 'Failed to fetch modules');
  }
  const list = data.data || [];
  return { data: list, pagination: data.pagination, total: data.total, filters: data.filters };
}

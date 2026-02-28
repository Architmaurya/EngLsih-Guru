import api from '../api/apiClient';
import { MODULES } from '../api/endpoints';

/**
 * GET /api/modules?class=X - modules for given class (1-5 for backend; English Guru may use 1-9).
 * Query: class (required), page, limit
 */
export async function getModulesByClass(classNumber, params = {}) {
  const query = { class: classNumber, ...params };
  console.log('[modulesService] getModulesByClass request', { endpoint: MODULES, query });
  const res = await api.get(MODULES, { params: query });
  const data = res?.data;
  if (!data?.success) {
    console.log('[modulesService] getModulesByClass failed', { classNumber, status: res?.status, message: data?.message });
    throw new Error(data?.message || 'Failed to fetch modules');
  }
  const list = data.data || [];
  console.log('[modulesService] getModulesByClass success', {
    class: classNumber,
    count: list.length,
    total: data.total,
    pagination: data.pagination,
    filters: data.filters,
    titles: list.map((m) => m.title),
  });
  return { data: list, pagination: data.pagination, total: data.total, filters: data.filters };
}

import api from '../api/apiClient';
import { ONBOARDING } from '../api/endpoints';

/**
 * Complete onboarding (English Guru).
 * Backend: PUT /api/onboarding, Bearer + X-Package-ID.
 * Payload: name, number (10-digit), class (1-9), parentAge (18-80).
 * @param {{ name: string, number: string, class: number, parentAge: number }} payload
 * @returns {Promise<{ id, name, email, number, class, parentAge, isOnboardingComplete }>}
 */
export async function completeOnboarding(payload) {
  const res = await api.put(ONBOARDING, payload);
  const data = res?.data;
  const result = data?.data ?? data;

  if (!data?.success) {
    const msg = data?.message || data?.error || result?.message || 'Onboarding failed';
    console.error('[onboardingService] Backend onboarding failed', { status: res?.status, data, message: msg });
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }

  return result;
}

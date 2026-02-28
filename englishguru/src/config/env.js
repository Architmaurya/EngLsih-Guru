/**
 * App config from .env via react-native-config.
 * Fallback WEB_CLIENT_ID so Google account picker works even if .env isn't loaded (e.g. before rebuild).
 */
let Config = {};
try {
  Config = require('react-native-config').default || {};
} catch (e) {
  // react-native-config not linked or .env not loaded
}

const API_BASE_URL = Config.API_BASE_URL || '';
const WEB_CLIENT_ID =
  Config.WEB_CLIENT_ID ||
  '601890245278-jbg05oftf76pprvmu52jq1gdjmmjfnbl.apps.googleusercontent.com';
const PROJECT_ID = Config.PROJECT_ID || 'learning-app-119d3';
/** CloudFront / CDN base for assets (categories, topics, thumbnails). Backend: CLOUDFRONT_DISTRIBUTION_DOMAIN */
const ASSET_BASE_URL =
  (Config.ASSET_BASE_URL && Config.ASSET_BASE_URL.startsWith('http') ? Config.ASSET_BASE_URL : null) ||
  (Config.CLOUDFRONT_DISTRIBUTION_DOMAIN ? `https://${Config.CLOUDFRONT_DISTRIBUTION_DOMAIN}` : null) ||
  'https://d1ta1qd8y4woyq.cloudfront.net';

export const config = {
  api: {
    baseURL: API_BASE_URL,
  },
  google: {
    webClientId: WEB_CLIENT_ID,
    projectId: PROJECT_ID,
  },
  assets: {
    baseURL: ASSET_BASE_URL,
  },
};

/**
 * Resolve image URL for API responses. Backend may return full URL or S3/CloudFront path.
 * @param {string|null|undefined} value - thumbnail, icon, or image path from API
 * @returns {string|null} - Full URL for Image source.uri, or null
 */
export function getAssetImageUrl(value) {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const path = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  return `${ASSET_BASE_URL}/${path}`;
}

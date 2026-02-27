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

export const config = {
  api: {
    baseURL: API_BASE_URL,
  },
  google: {
    webClientId: WEB_CLIENT_ID,
    projectId: PROJECT_ID,
  },
};

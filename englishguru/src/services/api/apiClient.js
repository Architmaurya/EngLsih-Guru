import axios from 'axios';
import { config } from '../../config/env';
import { secureStorage } from '../storage/secureStorage';

const PACKAGE_ID = 'com.gumbo.english';

const api = axios.create({
  baseURL: config.api.baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Package-ID': PACKAGE_ID,
  },
});

api.interceptors.request.use(
  async (axiosConfig) => {
    const token = await secureStorage.getAccessToken();
    console.log('token', token);
    if (token && axiosConfig.headers) {
      axiosConfig.headers.Authorization = `Bearer ${token}`;
    }
    return axiosConfig;
  },
  (err) => Promise.reject(err)
);

export default api;

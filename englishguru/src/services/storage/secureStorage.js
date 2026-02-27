import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USER_DATA: 'userData',
};

class SecureStorage {
  async setAccessToken(token) {
    try {
      await AsyncStorage.setItem(KEYS.ACCESS_TOKEN, token);
    } catch (e) {}
  }

  async getAccessToken() {
    try {
      return await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
    } catch (e) {
      return null;
    }
  }

  async setUserData(user) {
    try {
      await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(user));
    } catch (e) {}
  }

  async getUserData() {
    try {
      const raw = await AsyncStorage.getItem(KEYS.USER_DATA);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  async clearAll() {
    try {
      await AsyncStorage.multiRemove([KEYS.ACCESS_TOKEN, KEYS.USER_DATA]);
    } catch (e) {}
  }

  async isAuthenticated() {
    const token = await this.getAccessToken();
    return !!token;
  }
}

export const secureStorage = new SecureStorage();

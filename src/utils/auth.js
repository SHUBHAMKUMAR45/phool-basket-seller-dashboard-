import AsyncStorage from "@react-native-async-storage/async-storage";
import { Api, setToken, getToken } from "./api";

const USER_KEY = "currentUser";

export const AuthService = {
  register: async (userData) => {
    try {
      const result = await Api.register(userData);
      await setToken(result.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(result.user));
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message || "Registration failed." };
    }
  },

  login: async (email, password) => {
    try {
      const result = await Api.login({ email, password });
      await setToken(result.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(result.user));
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message || "Login failed." };
    }
  },

  logout: async () => {
    await setToken(null);
    await AsyncStorage.removeItem(USER_KEY);
  },

  getCurrentUser: async () => {
    const token = await getToken();
    if (!token) return null;

    const cached = await AsyncStorage.getItem(USER_KEY);
    if (cached) {
      try {
        await Api.me();
        return JSON.parse(cached);
      } catch {
        await AuthService.logout();
        return null;
      }
    }

    try {
      const result = await Api.me();
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(result.user));
      return result.user;
    } catch {
      await AuthService.logout();
      return null;
    }
  },
};

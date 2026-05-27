import { Platform } from "react-native";

// Set EXPO_PUBLIC_API_URL in .env for physical devices (e.g. http://192.168.1.5:3000/api)
export function getApiBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000/api";
  }
  return "http://localhost:3000/api";
}

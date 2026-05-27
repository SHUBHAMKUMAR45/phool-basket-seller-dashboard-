import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiBaseUrl } from "../config/api";

const TOKEN_KEY = "authToken";

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token) {
  if (token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } else {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }
}

export async function apiRequest(path, options = {}) {
  const baseUrl = getApiBaseUrl();
  const token = await getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = { success: false, message: "Invalid server response." };
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }
  return data;
}

export const Api = {
  health: () => apiRequest("/health"),
  register: (body) => apiRequest("/auth/register", { method: "POST", body }),
  login: (body) => apiRequest("/auth/login", { method: "POST", body }),
  me: () => apiRequest("/auth/me"),
  getProducts: () => apiRequest("/products"),
  createProduct: (body) => apiRequest("/products", { method: "POST", body }),
  deleteProduct: (id) => apiRequest(`/products/${id}`, { method: "DELETE" }),
  aiScan: () => apiRequest("/products/ai-scan", { method: "POST", body: {} }),
  getOrders: () => apiRequest("/orders"),
  updateOrderStatus: (id, status) => apiRequest(`/orders/${id}/status`, { method: "PATCH", body: { status } }),
  getCustomers: () => apiRequest("/customers"),
  getInventory: () => apiRequest("/inventory"),
  getCoupons: () => apiRequest("/coupons"),
  createCoupon: (body) => apiRequest("/coupons", { method: "POST", body }),
  getBanners: () => apiRequest("/banners"),
  createBanner: (body) => apiRequest("/banners", { method: "POST", body }),
  deleteBanner: (id) => apiRequest(`/banners/${id}`, { method: "DELETE" }),
  getNotifications: () => apiRequest("/notifications"),
  sendNotification: (body) => apiRequest("/notifications", { method: "POST", body }),
  getAnalytics: () => apiRequest("/analytics"),
  getDashboardStats: () => apiRequest("/dashboard/stats"),
  getActivities: () => apiRequest("/dashboard/activity"),
};

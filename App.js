import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/screens/HomeScreen";
import AdminOverview from "./src/screens/AdminOverview";
import SellerDashboard from "./src/screens/SellerDashboard";
import ProductManagement from "./src/screens/ProductManagement";
import OrderManagement from "./src/screens/OrderManagement";
import CustomerManagement from "./src/screens/CustomerManagement";
import InventoryScreen from "./src/screens/InventoryScreen";
import CouponManagement from "./src/screens/CouponManagement";
import BannerManagement from "./src/screens/BannerManagement";
import AnalyticsPage from "./src/screens/AnalyticsPage";
import NotificationPanel from "./src/screens/NotificationPanel";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

import { SafeAreaProvider } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Admin" component={AdminOverview} />
        <Stack.Screen name="Seller" component={SellerDashboard} />
        <Stack.Screen name="ProductManagement" component={ProductManagement} />
        <Stack.Screen name="OrderManagement" component={OrderManagement} />
        <Stack.Screen name="CustomerManagement" component={CustomerManagement} />
        <Stack.Screen name="Inventory" component={InventoryScreen} />
        <Stack.Screen name="Coupons" component={CouponManagement} />
        <Stack.Screen name="Banners" component={BannerManagement} />
        <Stack.Screen name="Analytics" component={AnalyticsPage} />
        <Stack.Screen name="Notifications" component={NotificationPanel} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}

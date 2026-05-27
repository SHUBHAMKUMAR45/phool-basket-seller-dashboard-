import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthService } from "../utils/auth";
import { Api } from "../utils/api";

const { width } = Dimensions.get("window");

export default function SellerDashboard({ navigation }) {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        Api.getDashboardStats(),
        Api.getActivities(),
      ]);
      setStats(statsRes.stats);
      setRecentActivity(activityRes.activities || []);
    } catch {
      setStats({
        totalOrders: 0,
        revenueToday: "₹0",
        pending: 0,
        monthlyRev: "₹0",
        weeklyOrders: [0, 0, 0, 0, 0, 0, 0],
      });
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const menuItems = [
    { title: "Products", icon: "📦", screen: "ProductManagement", desc: "Inventory control" },
    { title: "Orders", icon: "📋", screen: "OrderManagement", desc: "Track fulfillment" },
    { title: "Customers", icon: "👥", screen: "CustomerManagement", desc: "User insights" },
    { title: "Inventory", icon: "📊", screen: "Inventory", desc: "Stock alerts" },
    { title: "Analytics", icon: "📈", screen: "Analytics", desc: "Sales insights" },
    { title: "Notifications", icon: "🔔", screen: "Notifications", desc: "Broadcasts" },
    { title: "Coupons", icon: "🎁", screen: "Coupons", desc: "Active deals" },
    { title: "Banners", icon: "🖼️", screen: "Banners", desc: "App ads" },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#ec4899" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seller Center</Text>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={async () => {
            await AuthService.logout();
            navigation.replace("Login");
          }}
        >
          <View style={styles.profileCircle}>
            <Text style={styles.profileIcon}>🚪</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Statistics Row 1 */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrapper, { backgroundColor: "#fff1f2" }]}>
              <Text style={styles.statEmoji}>📦</Text>
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statNumber, { color: "#e11d48" }]}>{stats?.totalOrders ?? 0}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrapper, { backgroundColor: "#f0fdf4" }]}>
              <Text style={styles.statEmoji}>💰</Text>
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statNumber, { color: "#16a34a" }]}>{stats?.revenueToday ?? "₹0"}</Text>
              <Text style={styles.statLabel}>Revenue Today</Text>
            </View>
          </View>
        </View>

        {/* Statistics Row 2 */}
        <View style={[styles.statsRow, { paddingTop: 0 }]}>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrapper, { backgroundColor: "#fef9c3" }]}>
              <Text style={styles.statEmoji}>⏳</Text>
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statNumber, { color: "#ca8a04" }]}>{stats?.pending ?? 0}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrapper, { backgroundColor: "#f0f9ff" }]}>
              <Text style={styles.statEmoji}>🗓️</Text>
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statNumber, { color: "#0284c7" }]}>{stats?.monthlyRev ?? "₹0"}</Text>
              <Text style={styles.statLabel}>Monthly Rev</Text>
            </View>
          </View>
        </View>

        {/* Sales Performance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sales Performance</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartSub}>Weekly Orders Graph</Text>
              <View style={styles.chartLegend}>
                <View style={[styles.legendDot, { backgroundColor: "#ec4899" }]} />
                <Text style={styles.legendText}>Orders</Text>
              </View>
            </View>
            <View style={styles.chartContainer}>
              {(stats?.weeklyOrders || [0, 0, 0, 0, 0, 0, 0]).map((h, i) => (
                <View key={i} style={styles.barBox}>
                  <View style={[styles.bar, { height: h }]} />
                  <Text style={styles.barText}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Operational Hub */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Operational Hub</Text>
          <View style={styles.grid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.gridCard}
                onPress={() => navigation.navigate(item.screen)}
              >
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.gridTitle}>{item.title}</Text>
                <Text style={styles.gridDesc}>{item.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewMore}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityList}>
            {recentActivity.map((item) => (
              <View key={item.id} style={styles.activityItem}>
                <View style={[styles.activityIndicator, { backgroundColor: item.type === 'order' ? '#ec4899' : item.type === 'stock' ? '#10b981' : '#3b82f6' }]} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>{item.text}</Text>
                  <Text style={styles.activityTime}>{item.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.adminSwitch}
          onPress={() => navigation.navigate("Admin")}
        >
          <Text style={styles.adminSwitchText}>Enterprise Admin View</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0f172a",
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  profileCircle: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
  },
  profileIcon: {
    fontSize: 22,
    color: "#fff",
  },
  scrollContent: {
    paddingBottom: 20,
    backgroundColor: "#f8fafc",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  statEmoji: {
    fontSize: 18,
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  viewMore: {
    color: "#ec4899",
    fontWeight: "bold",
    fontSize: 14,
  },
  chartCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 20,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  chartSub: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  chartLegend: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "600",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 100,
  },
  barBox: {
    alignItems: "center",
    width: (width - 72) / 7,
  },
  bar: {
    width: 8,
    backgroundColor: "#ec4899",
    borderRadius: 4,
    marginBottom: 8,
  },
  barText: {
    fontSize: 10,
    color: "#cbd5e1",
    fontWeight: "bold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
  },
  gridCard: {
    backgroundColor: "#fff",
    width: "44%",
    marginHorizontal: "3%",
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    elevation: 2,
  },
  gridIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  gridIcon: {
    fontSize: 22,
  },
  gridTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0f172a",
  },
  gridDesc: {
    fontSize: 10,
    color: "#94a3b8",
    marginTop: 2,
  },
  activityList: {
    paddingHorizontal: 16,
  },
  activityItem: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  activityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  activityTime: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 2,
  },
  adminSwitch: {
    marginHorizontal: 16,
    backgroundColor: "#0f172a",
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  adminSwitchText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});

import React, { useState, useEffect, useCallback } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar, Dimensions, Platform, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthService } from "../utils/auth";
import { Api } from "../utils/api";

const { width: SCREEN_W } = Dimensions.get("window");

// ── Area Chart ───────────────────────────────────────────────────────────────
function AreaChart({ color = "#f97316", chartWidth }) {
  const points = [0.25, 0.20, 0.35, 0.42, 0.58, 0.72, 0.65];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const yLabels = ["8000", "6000", "4000", "2000"];
  const CHART_H = 110;
  const Y_W = 32;
  const usableW = chartWidth - Y_W - 8;
  const colW = usableW / points.length;

  return (
    <View style={{ height: CHART_H + 22, marginTop: 8 }}>
      {/* Horizontal grid lines + Y labels */}
      {yLabels.map((label, i) => {
        const top = (i / (yLabels.length - 1)) * (CHART_H - 10);
        return (
          <View key={label} style={{ position: "absolute", top, left: 0, right: 0, flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 7, color: "#cbd5e1", width: Y_W, textAlign: "right", paddingRight: 4 }}>{label}</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "#f1f5f9" }} />
          </View>
        );
      })}

      {/* Area fill columns */}
      <View style={{ position: "absolute", left: Y_W, top: 0, flexDirection: "row", alignItems: "flex-end", height: CHART_H - 10 }}>
        {points.map((p, i) => (
          <View key={i} style={{ width: colW, height: "100%", justifyContent: "flex-end" }}>
            <View style={{
              height: p * (CHART_H - 10),
              backgroundColor: color + "25",
              borderTopWidth: 2.5,
              borderTopColor: color,
              borderTopLeftRadius: i === 0 ? 0 : 0,
              borderTopRightRadius: i === points.length - 1 ? 0 : 0,
            }} />
          </View>
        ))}
      </View>

      {/* Dots on the curve */}
      {points.map((p, i) => {
        const dotX = Y_W + i * colW + colW / 2 - 4;
        const dotY = (CHART_H - 10) - p * (CHART_H - 10) - 4;
        return (
          <View key={"d" + i} style={{
            position: "absolute", left: dotX, top: dotY,
            width: 8, height: 8, borderRadius: 4,
            backgroundColor: color, borderWidth: 2, borderColor: "#fff",
            zIndex: 5,
          }} />
        );
      })}

      {/* X-axis labels */}
      <View style={{ position: "absolute", top: CHART_H - 4, left: Y_W, flexDirection: "row" }}>
        {days.map((d, i) => (
          <Text key={d + i} style={{ width: colW, textAlign: "center", fontSize: 7, color: "#94a3b8", fontWeight: "600" }}>{d}</Text>
        ))}
      </View>
    </View>
  );
}

// ── Horizontal Bar Chart ─────────────────────────────────────────────────────
function HBarChart({ items }) {
  const maxVal = Math.max(...items.map(i => i.val));
  return (
    <View style={{ marginTop: 12 }}>
      {items.map((item) => (
        <View key={item.label} style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <Text style={{ fontSize: 9, color: "#475569", fontWeight: "700", width: 38 }}>{item.label}</Text>
          <View style={{ flex: 1, height: 18, backgroundColor: "#f1f5f9", borderRadius: 9, overflow: "hidden" }}>
            <View style={{
              width: `${(item.val / maxVal) * 100}%`,
              height: "100%",
              backgroundColor: item.color,
              borderRadius: 9,
            }} />
          </View>
        </View>
      ))}
    </View>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, iconBg, value, label, change, up }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconBox, { backgroundColor: iconBg }]}>
        <Text style={{ fontSize: 18, color: "#fff" }}>{icon}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statChange, { color: up ? "#16a34a" : "#dc2626" }]}>
        {up ? "▲" : "▼"} {change}
      </Text>
    </View>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function AdminOverview({ navigation }) {
  const [activeTab, setActiveTab] = useState("Revenue");
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const chartW = SCREEN_W - 28;

  const loadDashboard = useCallback(async () => {
    try {
      const result = await Api.getDashboardStats();
      setDashboard(result);
    } catch {
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const admin = dashboard?.admin;
  const platform = dashboard?.platform;
  const topItems = admin?.topItems || [];
  const recentOrders = admin?.recentOrders || [];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#ec4899" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── HEADER (unchanged) ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Welcome back, Admin 👋</Text>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.switchBtn} onPress={() => navigation.navigate("Seller")}>
            <Text style={styles.switchBtnText}>Switch to Seller</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate("Notifications")}>
            <Text style={{ fontSize: 16 }}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarBtn} onPress={async () => { await AuthService.logout(); navigation.replace("Login"); }}>
            <Text style={styles.avatarText}>A</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={styles.subTitle}>Here's what's cooking today.</Text>

        {/* ── Stat Cards ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          <StatCard icon="$" iconBg="#3b82f6" value={admin?.totalRevenue || "$0"} label="Total Revenue" change="+13.5%" up />
          <StatCard icon="🛍" iconBg="#f59e0b" value={admin?.totalSales || "0"} label="Total Sales" change="+8.2%" up />
          <StatCard icon="📋" iconBg="#ef4444" value={admin?.ordersToday || "0"} label="Orders Today" change="-4.1%" up={false} />
          <StatCard icon="👥" iconBg="#22c55e" value={admin?.activeCustomers || "0"} label="Active Customers" change="+24.6%" up />
        </ScrollView>

        {/* ── Top Items ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top Items</Text>
          <Text style={styles.cardSub}>Best sellers this week</Text>
          <HBarChart items={topItems} />
        </View>

        {/* ── Revenue Overview ── */}
        <View style={styles.card}>
          <View style={styles.revenueHeader}>
            <View>
              <Text style={styles.cardTitle}>Revenue Overview</Text>
              <Text style={styles.cardSub}>Last 7 days</Text>
            </View>
            <View style={styles.legendRow}>
              {["Revenue", "Orders"].map(t => (
                <TouchableOpacity key={t} onPress={() => setActiveTab(t)}
                  style={[styles.legendPill, activeTab === t && { backgroundColor: "#f1f5f9" }]}>
                  <View style={[styles.legendDot, { backgroundColor: t === "Revenue" ? "#3b82f6" : "#ec4899" }]} />
                  <Text style={[styles.legendText, activeTab === t && { color: "#0f172a" }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <AreaChart
            color={activeTab === "Revenue" ? "#f97316" : "#ec4899"}
            chartWidth={chartW - 28}
          />
        </View>

        {/* ── Recent Orders ── */}
        <View style={styles.card}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.cardTitle}>Recent Orders</Text>
              <Text style={styles.cardSub}>Live feed of incoming orders</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("OrderManagement")}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          {/* Table header */}
          <View style={styles.tHead}>
            {["Order", "Customer", "Item", "Amount", "Status"].map(h => (
              <Text key={h} style={styles.tHeadCell}>{h}</Text>
            ))}
          </View>

          {recentOrders.map(o => (
            <View key={o.id} style={styles.tRow}>
              <Text style={[styles.tCell, { fontWeight: "700", color: "#334155" }]}>{o.id}</Text>
              <Text style={styles.tCell} numberOfLines={1}>{o.customer}</Text>
              <Text style={styles.tCell} numberOfLines={1}>{o.item}</Text>
              <Text style={[styles.tCell, { fontWeight: "700", color: "#0f172a" }]}>{o.amount}</Text>
              <View style={[styles.statusBadge, { backgroundColor: o.sc + "22" }]}>
                <Text style={{ fontSize: 8, fontWeight: "700", color: o.sc }}>{o.status}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Platform Stats ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Platform Stats</Text>
          <View style={styles.platformRow}>
            {[
              { label: "Products", value: String(platform?.products ?? 0), icon: "📦", color: "#8b5cf6" },
              { label: "Banners", value: String(platform?.banners ?? 0), icon: "🖼️", color: "#ec4899" },
              { label: "Coupons", value: String(platform?.coupons ?? 0), icon: "🎁", color: "#f59e0b" },
              { label: "Low Stock", value: String(platform?.lowStock ?? 0), icon: "⚠️", color: "#ef4444" },
            ].map(s => (
              <View key={s.label} style={styles.platformItem}>
                <Text style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</Text>
                <Text style={{ fontSize: 18, fontWeight: "800", color: s.color }}>{s.value}</Text>
                <Text style={{ fontSize: 9, color: "#94a3b8", fontWeight: "600", textAlign: "center", marginTop: 2 }}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },

  /* Header */
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#fff", paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 12 : 0, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: "#f1f5f9",
    elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4,
  },
  headerGreeting: { fontSize: 11, color: "#64748b", fontWeight: "500" },
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#0f172a", letterSpacing: -0.5 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  switchBtn: { backgroundColor: "#f1f5f9", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  switchBtnText: { fontSize: 11, fontWeight: "700", color: "#475569" },
  notifBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: "#f8fafc",
    justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#e2e8f0",
  },
  avatarBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#ec4899", justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 15 },

  subTitle: { fontSize: 13, color: "#64748b", paddingHorizontal: 20, paddingTop: 14, paddingBottom: 2 },

  /* Stat Cards */
  statCard: {
    backgroundColor: "#fff", borderRadius: 20, padding: 14, marginRight: 10, width: 138,
    elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8,
  },
  statIconBox: { width: 42, height: 42, borderRadius: 14, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  statValue: { fontSize: 20, fontWeight: "800", color: "#0f172a" },
  statLabel: { fontSize: 10, color: "#64748b", fontWeight: "600", marginTop: 2 },
  statChange: { fontSize: 10, fontWeight: "700", marginTop: 6 },


  /* Revenue header */
  revenueHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start",
  },
  legendRow: { flexDirection: "row", gap: 4 },
  legendPill: {
    flexDirection: "row", alignItems: "center", gap: 3,
    paddingHorizontal: 5, paddingVertical: 2, borderRadius: 6,
  },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  legendText: { fontSize: 8, color: "#94a3b8", fontWeight: "700" },

  /* Shared card */
  card: {
    backgroundColor: "#fff", borderRadius: 20, padding: 14,
    marginHorizontal: 14, marginBottom: 12,
    elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8,
  },
  cardTitle: { fontSize: 13, fontWeight: "800", color: "#0f172a" },
  cardSub: { fontSize: 10, color: "#94a3b8", marginTop: 1 },

  /* Orders */
  orderHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  viewAll: { color: "#ec4899", fontSize: 12, fontWeight: "700" },
  tHead: {
    flexDirection: "row", paddingVertical: 8, borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0", marginBottom: 2,
  },
  tHeadCell: { flex: 1, fontSize: 9, color: "#94a3b8", fontWeight: "700" },
  tRow: {
    flexDirection: "row", paddingVertical: 10, alignItems: "center",
    borderBottomWidth: 1, borderBottomColor: "#f8fafc",
  },
  tCell: { flex: 1, fontSize: 10, color: "#475569" },
  statusBadge: { flex: 1, borderRadius: 20, paddingVertical: 3, alignItems: "center" },

  /* Platform stats */
  platformRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
  platformItem: { alignItems: "center", flex: 1 },
});

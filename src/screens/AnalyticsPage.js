import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function AnalyticsPage({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics Insights</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Revenue Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Revenue Growth</Text>
          <View style={styles.chartCard}>
            <View style={styles.barChartRow}>
              {[30, 45, 60, 40, 80, 95, 70, 85, 100, 75, 90, 110].map((h, i) => (
                <View key={i} style={[styles.bar, { height: h }]} />
              ))}
            </View>
            <View style={styles.chartLabels}>
              <Text style={styles.chartLabel}>Jan</Text>
              <Text style={styles.chartLabel}>Jun</Text>
              <Text style={styles.chartLabel}>Dec</Text>
            </View>
          </View>
        </View>

        {/* Category-wise Sales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category-wise Sales</Text>
          <View style={styles.pieCard}>
            <View style={styles.pieRow}>
              <View style={[styles.pieSegment, { backgroundColor: "#ec4899", flex: 0.4 }]} />
              <View style={[styles.pieSegment, { backgroundColor: "#3b82f6", flex: 0.3 }]} />
              <View style={[styles.pieSegment, { backgroundColor: "#10b981", flex: 0.2 }]} />
              <View style={[styles.pieSegment, { backgroundColor: "#f59e0b", flex: 0.1 }]} />
            </View>
            <View style={styles.legendGrid}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#ec4899" }]} />
                <Text style={styles.legendText}>Roses (40%)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#3b82f6" }]} />
                <Text style={styles.legendText}>Wedding (30%)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#10b981" }]} />
                <Text style={styles.legendText}>Birthday (20%)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#f59e0b" }]} />
                <Text style={styles.legendText}>Others (10%)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Monthly Profit</Text>
            <Text style={styles.metricValue}>₹45,200</Text>
            <Text style={[styles.metricTrend, { color: "#10b981" }]}>+12% ↑</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Order Growth</Text>
            <Text style={styles.metricValue}>24%</Text>
            <Text style={[styles.metricTrend, { color: "#10b981" }]}>+5% ↑</Text>
          </View>
        </View>

        {/* Top Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Best Selling Products</Text>
          <View style={styles.tableCard}>
            {[
              { name: "Red Rose Bouquet", sales: "450", growth: "+15%" },
              { name: "Pink Lilies", sales: "320", growth: "+8%" },
              { name: "Wedding Special", sales: "210", growth: "+20%" },
            ].map((item, idx) => (
              <View key={idx} style={[styles.tableRow, idx === 2 && { borderBottomWidth: 0 }]}>
                <Text style={styles.tableName}>{item.name}</Text>
                <Text style={styles.tableSales}>{item.sales}</Text>
                <Text style={styles.tableGrowth}>{item.growth}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 22,
    color: "#0f172a",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  scrollContent: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 16,
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  barChartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
  },
  bar: {
    width: 6,
    backgroundColor: "#ec4899",
    borderRadius: 3,
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  chartLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
  },
  pieCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    elevation: 3,
  },
  pieRow: {
    height: 20,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  pieSegment: {
    height: "100%",
  },
  legendGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 12,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  metricCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    elevation: 3,
  },
  metricLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
    marginTop: 8,
  },
  metricTrend: {
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4,
  },
  tableCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 12,
    elevation: 3,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  tableName: {
    flex: 2,
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
  },
  tableSales: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    color: "#64748b",
    textAlign: "right",
  },
  tableGrowth: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    color: "#10b981",
    textAlign: "right",
  },
});

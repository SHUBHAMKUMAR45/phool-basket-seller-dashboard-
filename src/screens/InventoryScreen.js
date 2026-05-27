import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Api } from "../utils/api";

export default function InventoryScreen({ navigation }) {
  const [stockData, setStockData] = useState([]);
  const [alerts, setAlerts] = useState({ outOfStock: [], lowStock: [] });
  const [loading, setLoading] = useState(true);

  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);
      const result = await Api.getInventory();
      setStockData(result.inventory || []);
      setAlerts(result.alerts || { outOfStock: [], lowStock: [] });
    } catch (e) {
      Alert.alert("Error", e.message || "Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#ec4899" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inventory Monitor</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Critical Alerts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Urgent Attention</Text>
          <View style={styles.alertList}>
            {alerts.outOfStock.length > 0 && (
              <View style={[styles.alertCard, { backgroundColor: "#fef2f2", borderColor: "#fecaca" }]}>
                <Text style={styles.alertEmoji}>🥀</Text>
                <View style={styles.alertInfo}>
                  <Text style={styles.alertHead}>Out of Stock</Text>
                  <Text style={styles.alertBody}>
                    {alerts.outOfStock.map((i) => i.name).join(", ")} are completely sold out.
                  </Text>
                </View>
              </View>
            )}
            {alerts.lowStock.length > 0 && (
              <View style={[styles.alertCard, { backgroundColor: "#fffbeb", borderColor: "#fef3c7" }]}>
                <Text style={styles.alertEmoji}>⚠️</Text>
                <View style={styles.alertInfo}>
                  <Text style={styles.alertHead}>Low Stock Alert</Text>
                  <Text style={styles.alertBody}>
                    {alerts.lowStock.map((i) => `${i.name} (${i.stock} ${i.unit})`).join(", ")} are low.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Inventory Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Full Inventory Log</Text>
          <View style={styles.tableCard}>
            <View style={styles.tableHead}>
              <Text style={[styles.headText, { flex: 2 }]}>Item</Text>
              <Text style={[styles.headText, { flex: 1 }]}>Stock</Text>
              <Text style={[styles.headText, { flex: 1.5 }]}>Status</Text>
            </View>
            {stockData.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={[styles.rowText, { flex: 2, fontWeight: "700" }]}>{item.name}</Text>
                <Text style={[styles.rowText, { flex: 1 }]}>{item.stock} {item.unit}</Text>
                <View style={{ flex: 1.5 }}>
                  <View style={[styles.badge, { backgroundColor: item.status === 'In Stock' ? '#d1fae5' : item.status === 'Low Stock' ? '#fef3c7' : '#fee2e2' }]}>
                    <Text style={[styles.badgeText, { color: item.status === 'In Stock' ? '#059669' : item.status === 'Low Stock' ? '#d97706' : '#dc2626' }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Management</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionItem}>
              <Text style={styles.actionEmoji}>➕</Text>
              <Text style={styles.actionLabel}>Restock</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Text style={styles.actionEmoji}>📉</Text>
              <Text style={styles.actionLabel}>Wastage</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Text style={styles.actionEmoji}>📋</Text>
              <Text style={styles.actionLabel}>Audit</Text>
            </TouchableOpacity>
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
  alertList: {
    gap: 12,
  },
  alertCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
  },
  alertEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  alertHead: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0f172a",
  },
  alertBody: {
    fontSize: 13,
    color: "#475569",
    marginTop: 2,
  },
  tableCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    elevation: 2,
  },
  tableHead: {
    flexDirection: "row",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    alignItems: "center",
  },
  rowText: {
    fontSize: 14,
    color: "#334155",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  actionGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionItem: {
    backgroundColor: "#fff",
    width: "30%",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    elevation: 2,
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
});

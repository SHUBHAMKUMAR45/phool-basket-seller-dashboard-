import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Api } from "../utils/api";

export default function CustomerManagement({ navigation }) {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await Api.getCustomers();
      setCustomers(result.customers || []);
    } catch (e) {
      Alert.alert("Error", e.message || "Failed to load customers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.basicInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.subText}>{item.email}</Text>
          <Text style={styles.subText}>{item.phone}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Orders</Text>
          <Text style={styles.statVal}>{item.orders}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Spent</Text>
          <Text style={[styles.statVal, { color: "#ec4899" }]}>{item.spent}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Member Since</Text>
          <Text style={styles.statVal}>{item.joined}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Registry</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search by name, email or phone..." 
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#ec4899" />
      ) : (
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No customers found</Text>}
      />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  backButton: { width: 40, height: 40, borderRadius: 10, backgroundColor: "#f8fafc", justifyContent: "center", alignItems: "center" },
  backIcon: { fontSize: 20 },
  headerTitle: { fontSize: 18, fontWeight: "800" },
  searchSection: { padding: 16, backgroundColor: "#fff" },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#f1f5f9", borderRadius: 12, paddingHorizontal: 12 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14 },
  list: { padding: 16 },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 16, marginBottom: 16, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  cardTop: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 50, height: 50, borderRadius: 15, backgroundColor: "#0f172a", justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#fff", fontSize: 20, fontWeight: "800" },
  basicInfo: { marginLeft: 16 },
  name: { fontSize: 16, fontWeight: "800", color: "#0f172a" },
  subText: { fontSize: 12, color: "#64748b", marginTop: 2 },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 16 },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statBox: { alignItems: "center" },
  statLabel: { fontSize: 10, fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" },
  statVal: { fontSize: 14, fontWeight: "800", color: "#334155", marginTop: 4 },
  empty: { textAlign: "center", marginTop: 40, color: "#94a3b8", fontWeight: "700" },
});

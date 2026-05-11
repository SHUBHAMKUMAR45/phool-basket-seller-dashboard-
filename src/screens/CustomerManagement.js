import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CUSTOMERS = [
  { id: "1", name: "Anshul Verma", email: "anshul@example.com", phone: "+91 9876543210", orders: 5, spent: "₹4,500", joined: "Jan 2026" },
  { id: "2", name: "Riya Sharma", email: "riya@example.com", phone: "+91 8765432109", orders: 2, spent: "₹950", joined: "Feb 2026" },
  { id: "3", name: "Amit Singh", email: "amit@example.com", phone: "+91 7654321098", orders: 12, spent: "₹15,200", joined: "Mar 2026" },
  { id: "4", name: "Priya Das", email: "priya@example.com", phone: "+91 6543210987", orders: 8, spent: "₹8,900", joined: "Apr 2026" },
];

export default function CustomerManagement({ navigation }) {
  const [search, setSearch] = useState("");

  const filtered = CUSTOMERS.filter(c => 
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

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No customers found</Text>}
      />
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

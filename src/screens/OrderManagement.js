import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const INITIAL_ORDERS = [
  { id: "ORD-1024", customer: "Anshul Verma", amount: "₹1,250", status: "Pending", payment: "Paid", date: "10/05/2026", email: "anshul@example.com", phone: "+91 9876543210" },
  { id: "ORD-1023", customer: "Riya Sharma", amount: "₹450", status: "Preparing", payment: "COD", date: "10/05/2026", email: "riya@example.com", phone: "+91 8765432109" },
  { id: "ORD-1022", customer: "Amit Singh", amount: "₹2,100", status: "Shipped", payment: "Paid", date: "09/05/2026", email: "amit@example.com", phone: "+91 7654321098" },
  { id: "ORD-1021", customer: "Priya Das", amount: "₹899", status: "Delivered", payment: "Paid", date: "08/05/2026", email: "priya@example.com", phone: "+91 6543210987" },
];

export default function OrderManagement({ navigation }) {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filters = ["All", "Pending", "Preparing", "Shipped", "Delivered"];

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "#f59e0b";
      case "Preparing": return "#3b82f6";
      case "Shipped": return "#8b5cf6";
      case "Delivered": return "#10b981";
      default: return "#64748b";
    }
  };

  const filteredOrders = orders.filter(o => 
    (filter === "All" || o.status === filter) &&
    (o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()))
  );

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.columnHeader, { flex: 1.2 }]}>Order ID</Text>
      <Text style={[styles.columnHeader, { flex: 2 }]}>Customer</Text>
      <Text style={[styles.columnHeader, { flex: 1.5 }]}>Amount</Text>
      <Text style={[styles.columnHeader, { flex: 1.5 }]}>Status</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.tableRow} onPress={() => setSelectedOrder(item)}>
      <Text style={[styles.cellText, { flex: 1.2, fontWeight: "700" }]}>{item.id}</Text>
      <Text style={[styles.cellText, { flex: 2 }]}>{item.customer}</Text>
      <Text style={[styles.cellText, { flex: 1.5, fontWeight: "800", color: "#0f172a" }]}>{item.amount}</Text>
      <View style={{ flex: 1.5 }}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + "15" }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Management</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.topSection}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search by ID or Name" 
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
          {filters.map((f) => (
            <TouchableOpacity 
              key={f} 
              style={[styles.filterChip, filter === f && styles.activeFilter]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.activeFilterText]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.tableContainer}>
        {renderHeader()}
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      <Modal visible={!!selectedOrder} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Log Details</Text>
              <TouchableOpacity onPress={() => setSelectedOrder(null)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedOrder && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailCard}>
                  <Text style={styles.detailLabel}>CUSTOMER DETAILS</Text>
                  <Text style={styles.detailMain}>{selectedOrder.customer}</Text>
                  <Text style={styles.detailSub}>{selectedOrder.email}</Text>
                  <Text style={styles.detailSub}>{selectedOrder.phone}</Text>
                </View>

                <View style={styles.detailCard}>
                  <Text style={styles.detailLabel}>ORDER INFO</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoKey}>Order ID</Text>
                    <Text style={styles.infoVal}>{selectedOrder.id}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoKey}>Date</Text>
                    <Text style={styles.infoVal}>{selectedOrder.date}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoKey}>Payment Status</Text>
                    <Text style={[styles.infoVal, { color: selectedOrder.payment === 'Paid' ? '#10b981' : '#f59e0b' }]}>{selectedOrder.payment}</Text>
                  </View>
                </View>

                <View style={styles.statusUpdateBox}>
                  <Text style={styles.detailLabel}>UPDATE STATUS</Text>
                  <View style={styles.statusButtons}>
                    {filters.slice(1).map((s) => (
                      <TouchableOpacity 
                        key={s} 
                        style={[styles.statusBtn, selectedOrder.status === s && { backgroundColor: getStatusColor(s) }]}
                        onPress={() => {
                          setOrders(orders.map(o => o.id === selectedOrder.id ? {...o, status: s} : o));
                          setSelectedOrder({...selectedOrder, status: s});
                        }}
                      >
                        <Text style={[styles.statusBtnText, selectedOrder.status === s && { color: '#fff' }]}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 20,
    color: "#0f172a",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  topSection: {
    padding: 16,
    backgroundColor: "#fff",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "#0f172a",
  },
  filterBar: {
    flexDirection: "row",
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  activeFilter: {
    backgroundColor: "#0f172a",
    borderColor: "#0f172a",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
  },
  activeFilterText: {
    color: "#fff",
  },
  tableContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  columnHeader: {
    fontSize: 12,
    fontWeight: "800",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  cellText: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
  },
  closeIcon: {
    fontSize: 20,
    color: "#94a3b8",
  },
  detailCard: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94a3b8",
    marginBottom: 10,
    letterSpacing: 1,
  },
  detailMain: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  detailSub: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoKey: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
  },
  infoVal: {
    fontSize: 13,
    color: "#0f172a",
    fontWeight: "800",
  },
  statusUpdateBox: {
    marginTop: 8,
  },
  statusButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  statusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    marginRight: 8,
    marginBottom: 8,
  },
  statusBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
});

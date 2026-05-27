import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  StatusBar,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Api } from "../utils/api";

export default function CouponManagement({ navigation }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ code: "", discount: "", minAmount: "", expiry: "" });

  const loadCoupons = useCallback(async () => {
    try {
      setLoading(true);
      const result = await Api.getCoupons();
      setCoupons(result.coupons || []);
    } catch (e) {
      Alert.alert("Error", e.message || "Failed to load coupons.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const handleAdd = async () => {
    if (!form.code || !form.discount) return;
    try {
      const result = await Api.createCoupon(form);
      setCoupons([result.coupon, ...coupons]);
      setModalVisible(false);
      setForm({ code: "", discount: "", minAmount: "", expiry: "" });
    } catch (e) {
      Alert.alert("Error", e.message || "Failed to create coupon.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.voucherCard}>
      <View style={styles.voucherLeft}>
        <Text style={styles.vDiscount}>{item.discount}</Text>
        <Text style={styles.vOff}>OFF</Text>
      </View>
      <View style={styles.voucherDivider} />
      <View style={styles.voucherRight}>
        <Text style={styles.vCode}>{item.code}</Text>
        <Text style={styles.vSub}>Min. Order: {item.minAmount}</Text>
        <Text style={styles.vExpiry}>Expires: {item.expiry}</Text>
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
        <Text style={styles.headerTitle}>Offers & Coupons</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#0f172a" />
      ) : (
      <FlatList
        data={coupons}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.listTitle}>Available Vouchers</Text>}
      />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.mTitle}>Create Promo Coupon</Text>
            <ScrollView>
              <Text style={styles.label}>Coupon Code</Text>
              <TextInput style={styles.input} placeholder="e.g. SUMMER20" value={form.code} onChangeText={t => setForm({...form, code: t})} />
              
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.label}>Discount (%)</Text>
                  <TextInput style={styles.input} placeholder="e.g. 20" keyboardType="numeric" value={form.discount} onChangeText={t => setForm({...form, discount: t + "%"})} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Min. Amount</Text>
                  <TextInput style={styles.input} placeholder="e.g. 499" keyboardType="numeric" value={form.minAmount} onChangeText={t => setForm({...form, minAmount: "₹" + t})} />
                </View>
              </View>

              <Text style={styles.label}>Expiry Date</Text>
              <TextInput style={styles.input} placeholder="DD/MM/YYYY" value={form.expiry} onChangeText={t => setForm({...form, expiry: t})} />

              <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
                <Text style={styles.saveBtnText}>Activate Coupon</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Discard</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  backButton: { width: 40, height: 40, borderRadius: 10, backgroundColor: "#f8fafc", justifyContent: "center", alignItems: "center" },
  backIcon: { fontSize: 20 },
  headerTitle: { fontSize: 18, fontWeight: "800" },
  addButton: { backgroundColor: "#0f172a", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  addButtonText: { color: "#fff", fontWeight: "800" },
  list: { padding: 16 },
  listTitle: { fontSize: 14, fontWeight: "800", color: "#94a3b8", marginBottom: 16, textTransform: "uppercase" },
  voucherCard: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 16, marginBottom: 16, borderStyle: "dashed", borderWidth: 2, borderColor: "#ec4899", overflow: "hidden" },
  voucherLeft: { padding: 20, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", width: 100 },
  vDiscount: { fontSize: 24, fontWeight: "900", color: "#ec4899" },
  vOff: { fontSize: 12, fontWeight: "800", color: "#ec4899" },
  voucherDivider: { width: 1, backgroundColor: "#f1f5f9", marginVertical: 10 },
  voucherRight: { flex: 1, padding: 16, justifyContent: "center" },
  vCode: { fontSize: 18, fontWeight: "900", color: "#0f172a", letterSpacing: 1 },
  vSub: { fontSize: 12, color: "#64748b", marginTop: 4 },
  vExpiry: { fontSize: 11, fontWeight: "700", color: "#94a3b8", marginTop: 2 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modal: { backgroundColor: "#fff", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, maxHeight: "80%" },
  mTitle: { fontSize: 20, fontWeight: "800", marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "800", color: "#475569", marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: "#f1f5f9", borderRadius: 12, padding: 12, fontSize: 14 },
  row: { flexDirection: "row" },
  saveBtn: { backgroundColor: "#ec4899", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 24 },
  saveBtnText: { color: "#fff", fontWeight: "800" },
  cancelBtn: { padding: 16, alignItems: "center" },
  cancelBtnText: { color: "#94a3b8", fontWeight: "700" },
});

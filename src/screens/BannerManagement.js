import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const INITIAL_BANNERS = [
  { id: 1, title: "Mother's Day Special", type: "Promo", image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400&q=80" },
  { id: 2, title: "Summer Sale 20%", type: "Flash", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80" },
];

export default function BannerManagement({ navigation }) {
  const [banners, setBanners] = useState(INITIAL_BANNERS);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ title: "", type: "Promo" });

  const handleAdd = () => {
    if (form.title) {
      const newBanner = {
        id: Date.now(),
        ...form,
        image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400&q=80"
      };
      setBanners([...banners, newBanner]);
      setModalVisible(false);
      setForm({ title: "", type: "Promo" });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Display Ads</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Banners</Text>
          {banners.map(banner => (
            <View key={banner.id} style={styles.bannerCard}>
              <Image source={{ uri: banner.image }} style={styles.bannerImage} />
              <View style={styles.bannerOverlay}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{banner.type}</Text>
                </View>
                <View>
                  <Text style={styles.bannerTitle}>{banner.title}</Text>
                  <Text style={styles.bannerStatus}>Active on App Home</Text>
                </View>
              </View>
              <View style={styles.bannerActions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>✏️ Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => setBanners(banners.filter(b => b.id !== banner.id))}
                >
                  <Text style={[styles.actionBtnText, styles.deleteBtnText]}>🗑️ Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Campaign Slots</Text>
          <View style={styles.slotCard}>
            <Text style={styles.slotTitle}>App Homepage Slider</Text>
            <Text style={styles.slotSub}>{banners.length}/5 Slots Filled</Text>
            <TouchableOpacity style={styles.manageSlotBtn}>
              <Text style={styles.manageSlotBtnText}>Optimize Slider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Launch New Campaign</Text>
            
            <Text style={styles.label}>Campaign Title</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Diwali Dhamaka" 
              value={form.title}
              onChangeText={t => setForm({...form, title: t})}
            />

            <Text style={styles.label}>Banner Type</Text>
            <View style={styles.typeRow}>
              {["Promo", "Flash", "Event"].map(type => (
                <TouchableOpacity 
                  key={type} 
                  style={[styles.typeChip, form.type === type && styles.activeType]}
                  onPress={() => setForm({...form, type})}
                >
                  <Text style={[styles.typeChipText, form.type === type && styles.activeTypeText]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
              <Text style={styles.saveBtnText}>Publish Ad Banner</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Discard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  addButton: {
    backgroundColor: "#ec4899",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
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
  bannerCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  bannerImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#f1f5f9",
  },
  bannerOverlay: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  typeBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#fef2f2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  typeText: {
    color: "#ef4444",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
  },
  bannerStatus: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
    fontWeight: "500",
  },
  bannerActions: {
    flexDirection: "row",
    padding: 12,
  },
  actionBtn: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },
  deleteBtn: {
    marginLeft: 8,
  },
  deleteBtnText: {
    color: "#ef4444",
  },
  slotCard: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  slotTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0f172a",
  },
  slotSub: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
    marginBottom: 20,
  },
  manageSlotBtn: {
    backgroundColor: "#f1f5f9",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  manageSlotBtnText: {
    color: "#0f172a",
    fontWeight: "700",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    justifyContent: "center",
    padding: 24,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: "#64748b",
    marginBottom: 8,
    marginTop: 16,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    color: "#0f172a",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  typeRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    marginRight: 10,
  },
  activeType: {
    backgroundColor: "#ec4899",
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
  },
  activeTypeText: {
    color: "#fff",
  },
  saveBtn: {
    backgroundColor: "#0f172a",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 32,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  cancelBtn: {
    alignItems: "center",
    marginTop: 16,
  },
  cancelBtnText: {
    color: "#94a3b8",
    fontWeight: "700",
  },
});

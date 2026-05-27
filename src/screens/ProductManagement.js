import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  TextInput,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { Api } from "../utils/api";

export default function ProductManagement({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState(null);
  
  const [form, setForm] = useState({ 
    name: "", 
    price: "", 
    stock: "", 
    category: "Roses", 
    desc: "", 
    discount: "0%" 
  });

  const categories = ["All", "Birthday", "Anniversary", "Wedding", "Roses", "Plants"];

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const result = await Api.getProducts();
      setProducts(result.products || []);
    } catch (e) {
      Alert.alert("Error", e.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setScannedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setScannedImage(result.assets[0].uri);
    }
  };

  const simulateAIScan = async () => {
    if (!scannedImage) {
      Alert.alert("No Image", "Please upload or take a photo first to scan.");
      return;
    }
    setIsScanning(true);
    try {
      const result = await Api.aiScan();
      setForm(result.suggestion);
    } catch (e) {
      Alert.alert("Error", e.message || "AI scan failed.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.price) return;
    try {
      const result = await Api.createProduct({
        ...form,
        image: scannedImage || "https://images.unsplash.com/photo-1522673607200-1648832cee98?w=400&q=80",
      });
      setProducts([result.product, ...products]);
      setModalVisible(false);
      resetForm();
    } catch (e) {
      Alert.alert("Error", e.message || "Failed to save product.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await Api.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (e) {
      Alert.alert("Error", e.message || "Failed to delete product.");
    }
  };

  const resetForm = () => {
    setForm({ name: "", price: "", stock: "", category: "Roses", desc: "", discount: "0%" });
    setScannedImage(null);
  };

  const filtered = products.filter(p => 
    (activeCategory === "All" || p.category === activeCategory) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Catalog Manager</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ New Item</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search inventory..." 
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#94a3b8"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {categories.map(c => (
            <TouchableOpacity key={c} style={[styles.catChip, activeCategory === c && styles.activeCat]} onPress={() => setActiveCategory(c)}>
              <Text style={[styles.catText, activeCategory === c && styles.activeCatText]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#ec4899" />
      ) : (
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.img} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.cat}>{item.category} • {item.stock} in stock</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{item.price}</Text>
                {item.discount !== "0%" && <Text style={styles.disc}>{item.discount} OFF</Text>}
              </View>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.delIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 40, color: "#94a3b8" }}>No products found</Text>}
      />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Product Creation</Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); resetForm(); }}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Media & AI Scanner Section */}
              <View style={styles.scannerBox}>
                {scannedImage ? (
                  <View style={styles.previewWrapper}>
                    <Image source={{ uri: scannedImage }} style={styles.scanPreview} />
                    <TouchableOpacity style={styles.removeImage} onPress={() => setScannedImage(null)}>
                      <Text style={styles.removeText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.scanPlaceholder}>
                    <Text style={styles.scanIcon}>📸</Text>
                    <Text style={styles.scanHint}>Upload a high-quality bouquet image</Text>
                    <View style={styles.uploadOptions}>
                      <TouchableOpacity style={styles.optBtn} onPress={takePhoto}>
                        <Text style={styles.optBtnText}>Take Photo</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.optBtn, { backgroundColor: "#f1f5f9" }]} onPress={pickImage}>
                        <Text style={[styles.optBtnText, { color: "#0f172a" }]}>Gallery</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                
                <TouchableOpacity 
                  style={[styles.scanActionBtn, !scannedImage && { backgroundColor: "#cbd5e1" }]} 
                  onPress={simulateAIScan}
                  disabled={isScanning || !scannedImage}
                >
                  {isScanning ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.scanActionText}>✨ Run AI Product Analysis</Text>
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Product Name</Text>
              <TextInput style={styles.input} value={form.name} onChangeText={t => setForm({...form, name: t})} placeholder="e.g. Red Rose Bouquet" />
              
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.label}>Price (₹)</Text>
                  <TextInput style={styles.input} keyboardType="numeric" value={form.price} onChangeText={t => setForm({...form, price: t})} placeholder="0.00" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Stock</Text>
                  <TextInput style={styles.input} keyboardType="numeric" value={form.stock} onChangeText={t => setForm({...form, stock: t})} placeholder="Qty" />
                </View>
              </View>

              <Text style={styles.label}>Category</Text>
              <View style={styles.catGrid}>
                {categories.slice(1).map(c => (
                  <TouchableOpacity key={c} style={[styles.miniChip, form.category === c && styles.activeCat]} onPress={() => setForm({...form, category: c})}>
                    <Text style={[styles.catText, form.category === c && styles.activeCatText]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Description</Text>
              <TextInput style={[styles.input, { height: 80 }]} multiline value={form.desc} onChangeText={t => setForm({...form, desc: t})} placeholder="Product details..." />
              
              <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
                <Text style={styles.saveBtnText}>Verify & Save Product</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  backButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: "#f8fafc", justifyContent: "center", alignItems: "center" },
  backIcon: { fontSize: 20, color: "#0f172a" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#0f172a" },
  addButton: { backgroundColor: "#0f172a", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  addButtonText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  searchBar: { padding: 16, backgroundColor: "#fff" },
  searchInput: { backgroundColor: "#f1f5f9", borderRadius: 14, padding: 14, marginBottom: 16, fontSize: 15, color: "#0f172a" },
  catScroll: { flexDirection: "row" },
  catChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: "#f1f5f9", marginRight: 8 },
  activeCat: { backgroundColor: "#ec4899" },
  catText: { fontSize: 13, fontWeight: "700", color: "#64748b" },
  activeCatText: { color: "#fff" },
  list: { padding: 16 },
  card: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 20, padding: 12, marginBottom: 16, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, alignItems: "center" },
  img: { width: 80, height: 80, borderRadius: 16 },
  info: { flex: 1, marginLeft: 16 },
  name: { fontSize: 16, fontWeight: "800", color: "#1e293b" },
  cat: { fontSize: 12, color: "#94a3b8", marginTop: 4, fontWeight: "600" },
  priceRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  price: { fontSize: 17, fontWeight: "900", color: "#0f172a" },
  disc: { fontSize: 10, color: "#ec4899", fontWeight: "800", marginLeft: 8, backgroundColor: "#fce7f3", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  delIcon: { fontSize: 18, color: "#cbd5e1" },
  overlay: { flex: 1, backgroundColor: "rgba(15, 23, 42, 0.7)", justifyContent: "flex-end" },
  modal: { backgroundColor: "#fff", borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: "90%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: "800", color: "#0f172a" },
  closeIcon: { fontSize: 20, color: "#94a3b8" },
  scannerBox: { backgroundColor: "#f8fafc", borderRadius: 20, padding: 16, marginBottom: 24, borderStyle: "dashed", borderWidth: 2, borderColor: "#e2e8f0", alignItems: "center" },
  scanPlaceholder: { height: 160, justifyContent: "center", alignItems: "center", width: "100%" },
  scanIcon: { fontSize: 40, marginBottom: 10 },
  scanHint: { color: "#94a3b8", fontSize: 12, fontWeight: "700", marginBottom: 16 },
  uploadOptions: { flexDirection: "row", gap: 12 },
  optBtn: { backgroundColor: "#0f172a", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  optBtnText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  previewWrapper: { width: "100%", height: 200, marginBottom: 16, position: "relative" },
  scanPreview: { width: "100%", height: "100%", borderRadius: 16 },
  removeImage: { position: "absolute", top: 10, right: 10, backgroundColor: "rgba(239, 68, 68, 0.9)", width: 30, height: 30, borderRadius: 15, justifyContent: "center", alignItems: "center" },
  removeText: { color: "#fff", fontWeight: "bold" },
  scanActionBtn: { backgroundColor: "#ec4899", width: "100%", padding: 16, borderRadius: 14, alignItems: "center" },
  scanActionText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  label: { fontSize: 13, fontWeight: "800", color: "#64748b", marginBottom: 8, marginTop: 16, textTransform: "uppercase" },
  input: { backgroundColor: "#f1f5f9", borderRadius: 14, padding: 14, fontSize: 15, color: "#0f172a" },
  row: { flexDirection: "row" },
  catGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
  miniChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: "#f1f5f9", marginRight: 8, marginBottom: 8 },
  saveBtn: { backgroundColor: "#0f172a", padding: 18, borderRadius: 16, alignItems: "center", marginTop: 32, marginBottom: 20 },
  saveBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});

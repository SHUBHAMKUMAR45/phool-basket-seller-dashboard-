import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationPanel({ navigation }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("Promotion");

  const categories = ["Promotion", "Festival", "Order Update", "Critical"];

  const handleSend = () => {
    if (!title || !message) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    Alert.alert("Success", "Notification sent successfully to all users!");
    setTitle("");
    setMessage("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Broadcast Center</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Push Notifications</Text>
          <Text style={styles.infoDesc}>Send app-wide alerts, festival offers, or order updates to your customers instantly.</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Notification Category</Text>
          <View style={styles.categoryRow}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, category === cat && styles.activeChip]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.categoryText, category === cat && styles.activeText]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Festival Offer!"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Message Body</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Type your message here..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            placeholderTextColor="#94a3b8"
          />

          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>🚀 Send to All Customers</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Broadcasts</Text>
          <View style={styles.broadcastItem}>
            <View style={styles.broadcastInfo}>
              <Text style={styles.broadcastTitle}>Mother's Day Sale Live!</Text>
              <Text style={styles.broadcastTime}>Today, 10:00 AM • 5,200 reached</Text>
            </View>
            <Text style={styles.statusBadge}>Sent</Text>
          </View>
          <View style={styles.broadcastItem}>
            <View style={styles.broadcastInfo}>
              <Text style={styles.broadcastTitle}>New Anniversary Collection</Text>
              <Text style={styles.broadcastTime}>Yesterday • 4,800 reached</Text>
            </View>
            <Text style={styles.statusBadge}>Sent</Text>
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
  infoCard: {
    backgroundColor: "#ec4899",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },
  infoDesc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 8,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    elevation: 2,
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 8,
    marginTop: 16,
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  categoryChip: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  activeChip: {
    backgroundColor: "#fce7f3",
    borderWidth: 1,
    borderColor: "#ec4899",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
  },
  activeText: {
    color: "#ec4899",
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
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  sendButton: {
    backgroundColor: "#0f172a",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 24,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  recentSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 16,
  },
  broadcastItem: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  broadcastInfo: {
    flex: 1,
  },
  broadcastTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  broadcastTime: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2,
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: "800",
    color: "#10b981",
    backgroundColor: "#d1fae5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});

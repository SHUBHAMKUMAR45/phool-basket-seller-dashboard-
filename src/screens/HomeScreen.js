import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthService } from "../utils/auth";

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Seller Dashboard App</Text>

      <Text style={styles.subtitle}>
        Control & Monitor Phool Basket Activity
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Admin Overview</Text>

        <Text style={styles.cardText}>
          Revenue, analytics & app activity
        </Text>

        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => navigation.navigate("Admin")}
        >
          <Text style={styles.buttonText}>
            Open Admin Panel
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🛒 Seller Dashboard</Text>
        <Text style={styles.cardText}>
          Products, orders & inventory management
        </Text>
        <TouchableOpacity
          style={styles.sellerButton}
          onPress={() => navigation.navigate("Seller")}
        >
          <Text style={styles.buttonText}>
            Open Seller Dashboard
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={async () => {
          await AuthService.logout();
          navigation.replace("Login");
        }}
      >
        <Text style={styles.logoutBtnText}>Logout from Device</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf4ff",
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#7e22ce",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 40,
    fontSize: 16,
  },

  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    marginBottom: 25,
    elevation: 5,
  },

  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },

  cardText: {
    color: "#666",
    marginBottom: 20,
    fontSize: 16,
  },

  adminButton: {
    backgroundColor: "#9333ea",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  sellerButton: {
    backgroundColor: "#ec4899",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutBtn: {
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  logoutBtnText: {
    color: "#94a3b8",
    fontWeight: "700",
    fontSize: 14,
  },
});

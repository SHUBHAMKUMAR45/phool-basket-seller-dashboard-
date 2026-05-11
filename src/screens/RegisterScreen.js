import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { AuthService } from "../utils/auth";

const { width, height } = Dimensions.get("window");

export default function RegisterScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    storeName: "",
    password: "",
  });

  const handleRegister = async () => {
    if (!form.email || !form.password || !form.name) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    const result = await AuthService.register(form);
    setLoading(false);

    if (result.success) {
      Alert.alert("Success", "Store registered successfully!", [
        { text: "OK", onPress: () => navigation.replace("Home") }
      ]);
    } else {
      Alert.alert("Registration Failed", result.message);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80" }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay} />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Text style={styles.brand}>Join Phool</Text>
              <Text style={styles.tagline}>Start your floral business today</Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.welcomeText}>Create Account</Text>
              <Text style={styles.subText}>Partner with us to reach thousands</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  value={form.name}
                  onChangeText={(t) => setForm({ ...form, name: t })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Store Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Green Petals Flora"
                  value={form.storeName}
                  onChangeText={(t) => setForm({ ...form, storeName: t })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="owner@store.com"
                  value={form.email}
                  onChangeText={(t) => setForm({ ...form, email: t })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  value={form.password}
                  onChangeText={(t) => setForm({ ...form, password: t })}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity 
                style={[styles.loginButton, loading && { opacity: 0.7 }]} 
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginButtonText}>Register as Seller</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.registerLink}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.registerText}>
                  Already a partner? <Text style={styles.boldText}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  brand: {
    fontSize: 42,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 14,
    color: "#ec4899",
    fontWeight: "800",
    textTransform: "uppercase",
    marginTop: 5,
    letterSpacing: 2,
  },
  formCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 30,
    padding: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
  },
  subText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 5,
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: "#475569",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    color: "#0f172a",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  loginButton: {
    backgroundColor: "#ec4899",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    color: "#64748b",
  },
  boldText: {
    color: "#0f172a",
    fontWeight: "800",
  },
});

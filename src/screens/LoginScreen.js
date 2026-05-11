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
  Alert,
  ActivityIndicator,
} from "react-native";
import { AuthService } from "../utils/auth";

const { width, height } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const checkUser = async () => {
      const user = await AuthService.getCurrentUser();
      if (user) {
        navigation.replace("Home");
      }
    };
    checkUser();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    const result = await AuthService.login(email, password);
    setLoading(false);

    if (result.success) {
      navigation.replace("Home");
    } else {
      Alert.alert("Login Failed", result.message);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1518191766482-824eddf751af?w=800&q=80" }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay} />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          <View style={styles.header}>
            <Text style={styles.brand}>Phool Basket</Text>
            <Text style={styles.tagline}>Seller Enterprise Dashboard</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subText}>Sign in to manage your store</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="owner@phoolbasket.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              style={[styles.loginButton, loading && { opacity: 0.7 }]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Access Dashboard</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.registerLink}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.registerText}>
                Don't have an account? <Text style={styles.boldText}>Register Now</Text>
              </Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
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
    marginBottom: 20,
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
    backgroundColor: "#0f172a",
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
    color: "#ec4899",
    fontWeight: "800",
  },
});

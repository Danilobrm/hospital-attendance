import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useMutation } from "@tanstack/react-query";
import { registerPatient } from "../../api/auth"; // Assuming registerPatient is now in "../../api/auth"
import moment from "moment";

const windowHeight = Dimensions.get("window").height;

// Define the shape of the data needed for registration
interface RegisterData {
  name: string;
  email: string;
  password: string;
  birthDate: string; // ISO 8601 format
  phone: string;
}

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  // 1. State for all DTO fields
  const [name, setName] = useState("Jane Doe");
  const [email, setEmail] = useState("jane.doe@example.com");
  const [password, setPassword] = useState("SecurePwd123");
  const [birthDate, setBirthDate] = useState("1995-10-25"); // YYYY-MM-DD format for input
  const [phone, setPhone] = useState("555-123-4567");

  const [localDisplayError, setLocalDisplayError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSuccess = useCallback(() => {
    console.log("Registration Successful!");
    setSuccessMessage("Account created successfully! Please log in.");

    // Optionally clear fields after success
    setName("");
    setEmail("");
    setPassword("");
    setBirthDate("");
    setPhone("");

    setTimeout(() => {
      setSuccessMessage("");
      navigation.navigate("Login"); // Navigate back to login
    }, 1500);
  }, [navigation]);

  const handleError = useCallback((error: { response?: any; request?: any; message?: string }) => {
    if (error.response) {
      // Use the structure expected from NestJS/Axios 400/409 errors
      const message = error.response.data?.message || error.response.data || "Registration failed.";
      setLocalDisplayError(Array.isArray(message) ? message.join(", ") : message);
    } else if (error.request) {
      setLocalDisplayError("Network error: No response from server.");
    } else {
      setLocalDisplayError(error.message ?? "An unknown error occurred.");
    }
  }, []);

  const registerPatientMutation = useMutation({
    mutationFn: (data: RegisterData) => registerPatient(data),
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const handleRegister = () => {
    setLocalDisplayError("");
    setSuccessMessage("");

    // 2. Updated validation for all required fields
    if (!name || !email || !password || !birthDate || !phone) {
      setLocalDisplayError("Please fill in all fields.");
      return;
    }

    // Simple date validation and formatting to ISO
    const birthDateISO = moment(birthDate, "YYYY-MM-DD", true).toISOString();

    if (birthDateISO === "Invalid date") {
      setLocalDisplayError("Please enter a valid birth date (YYYY-MM-DD).");
      return;
    }

    const registrationData: RegisterData = {
      name,
      email: email.trim(),
      password,
      birthDate: birthDateISO,
      phone,
    };

    registerPatientMutation.mutate(registrationData);
  };

  const handleGoToLogin = () => {
    navigation.navigate("Login");
  };

  const currentError = localDisplayError || registerPatientMutation.error;
  const isPending = registerPatientMutation.isPending;

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us to start booking appointments.</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
            editable={!isPending}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!isPending}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!isPending}
          />
          {/* New Field: Birth Date */}
          <TextInput
            style={styles.input}
            placeholder="Birth Date (YYYY-MM-DD)"
            placeholderTextColor="#9ca3af"
            keyboardType="numbers-and-punctuation"
            value={birthDate}
            onChangeText={setBirthDate}
            editable={!isPending}
          />
          {/* New Field: Phone Number */}
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#9ca3af"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            editable={!isPending}
          />

          {/* Display Success Message */}
          {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

          {/* Display Error Message */}
          {currentError ? (
            <Text style={styles.errorText}>
              {typeof currentError === "string"
                ? currentError
                : (currentError as any) instanceof Error
                  ? (currentError as Error).message
                  : "Registration failed."}
            </Text>
          ) : null}

          <TouchableOpacity
            style={[styles.button, isPending && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginLink} onPress={handleGoToLogin}>
          <Text style={styles.loginLinkText}>
            Already have an account? <Text style={styles.loginLinkHighlight}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
};

// --- STYLESHEET (Adding successText style) ---

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#3b82f6",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 24,
    paddingTop: windowHeight * 0.1,
    alignItems: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 4,
  },

  form: {
    width: "100%",
    maxWidth: 360,
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#1f2937",
  },
  errorText: {
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "500",
  },
  successText: {
    // ⬅️ NEW STYLE ADDED
    color: "#22c55e",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "500",
  },
  button: {
    height: 50,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginLink: {
    marginTop: 30,
    paddingVertical: 10,
  },
  loginLinkText: {
    fontSize: 14,
    color: "#6b7280",
  },
  loginLinkHighlight: {
    fontWeight: "bold",
    color: "#3b82f6",
  },
});

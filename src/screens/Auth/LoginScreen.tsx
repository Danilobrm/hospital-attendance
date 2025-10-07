import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
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
import { loginPatient } from "../../api/auth";
import { Patient } from "../../interfaces/patient";
import { useAuth } from "../../contexts/AuthContext";

// --- MOCK NAVIGATION IMPORTS (Consistent with HomeScreen implementation) ---
interface NavigationProp {
  navigate: (screen: string, params?: any) => void;
  // Add other methods like replace, goBack, etc., as needed
}

// NOTE: Uncomment the real useNavigation hook when ready
// const useNavigation = (): NavigationProp => ({
//   navigate: (screen: string, params?: any) => {
//     console.log(`[NAVIGATE] Attempting to go to: ${screen} with params:`, params);
//     // In a real app, this would change the visible screen
//   },
// });
// --------------------------------------------------------------------------

const windowHeight = Dimensions.get("window").height;

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [localDisplayError, setLocalDisplayError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = () => {
    setLocalDisplayError("");
    setSuccessMessage("");

    if (!email.trim() || !password.trim()) {
      setLocalDisplayError("Please enter both email and password.");
      return;
    }

    loginPatientMutation.mutate({ email: email.trim(), password: password.trim() });
  };

  const handleSuccess = useCallback(
    async (data: { token: string }) => {
      console.log("Login Successful!");
      setSuccessMessage("Login successful!");

      await login(data.token);

      setTimeout(() => {
        setSuccessMessage("");
      }, 500);
    },
    [login, navigation]
  );

  const handleError = useCallback((error: { response?: any; request?: any; message?: string }) => {
    if (error.response) {
      const message = error.response.data?.message || error.response.data || "Unknown error";
      setLocalDisplayError(message);
    } else if (error.request) {
      setLocalDisplayError("No response from server");
    } else {
      setLocalDisplayError(error.message ?? "Unknown error");
    }
  }, []);

  const loginPatientMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => loginPatient(email, password),
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const handleGoToRegister = () => {
    navigation.navigate("Register" as never);
  };

  const currentError = localDisplayError || loginPatientMutation.error;

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Hospital Attendance</Text>
          <Text style={styles.subtitle}>Sign in to find your next appointment.</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Display Success Message */}
          {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

          {/* Display Error Message (from validation or mutation) */}
          {currentError ? (
            <Text style={styles.errorText}>
              {typeof currentError === "string"
                ? currentError
                : (currentError as any) instanceof Error
                  ? (currentError as Error).message
                  : ""}
            </Text>
          ) : null}

          <TouchableOpacity
            // Use mutation.isPending for disabled/styling
            style={[styles.button, loginPatientMutation.isPending && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loginPatientMutation.isPending}
          >
            {loginPatientMutation.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Log In</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Register Link */}
        <TouchableOpacity style={styles.registerLink} onPress={handleGoToRegister}>
          <Text style={styles.registerLinkText}>
            Don't have an account? <Text style={styles.registerLinkHighlight}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
};

// --- STYLESHEET (Updated for new Register link) ---

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#3b82f6", // Match header blue
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa", // Light background
    paddingHorizontal: 24,
    paddingTop: windowHeight * 0.1, // Pushes content down slightly
    alignItems: "center",
  },

  // Header/Branding
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

  // Form
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
    backgroundColor: "#93c5fd", // Lighter blue when disabled
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  // Footer Links
  forgotPasswordButton: {
    marginTop: 20,
    marginBottom: 20, // Added margin for spacing
  },
  forgotPasswordText: {
    color: "#3b82f6",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  registerLink: {
    marginTop: 20,
    paddingVertical: 10,
  },
  registerLinkText: {
    fontSize: 14,
    color: "#6b7280",
  },
  registerLinkHighlight: {
    fontWeight: "bold",
    color: "#3b82f6",
  },
});

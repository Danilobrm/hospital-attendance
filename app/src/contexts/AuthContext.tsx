import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Patient } from "../interfaces/patient";
import { fetchFullPatientProfile } from "../api/auth";

interface AuthData {
  token: string | null;
  patient: Patient | null;
}

interface AuthContextProps extends AuthData {
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("@token");
        const storedPatientString = await AsyncStorage.getItem("@patient");

        if (storedToken && storedPatientString) {
          const storedPatient: Patient = JSON.parse(storedPatientString);

          setToken(storedToken);
          setPatient(storedPatient);
        }
      } catch (error) {
        console.error("Error loading auth data", error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const login = useCallback(async (newToken: string) => {
    setToken(newToken);
    // setPatient(basicPatientData);
    await AsyncStorage.setItem("@token", newToken);
    // await AsyncStorage.setItem("@patient", JSON.stringify(basicPatientData));

    try {
      const fullProfile = await fetchFullPatientProfile(newToken);

      setPatient(fullProfile);
      await AsyncStorage.setItem("@patient", JSON.stringify(fullProfile));
    } catch (error) {
      console.error("Failed to fetch full patient profile after login. Proceeding with basic data.", error);
    }
  }, []);

  const logout = async () => {
    setToken(null);
    setPatient(null);
    await AsyncStorage.multiRemove(["@token", "@patient"]);
  };

  const value: AuthContextProps = {
    token,
    patient,
    isAuthenticated: !!token,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import AsyncStorage from "@react-native-async-storage/async-storage";
import { client } from "./api";
import { Patient } from "../interfaces/patient";

export const loginPatient = async (email: string, password: string): Promise<{ token: string; patient: Patient }> => {
  const credentials = {
    email: "john.doe@hospital.com",
    password: "secretpatientpassword",
  };

  // const credentials = { email, password };

  const response = await client.post("/auth/login/patient", credentials);
  const { token, patient } = response.data;
  await AsyncStorage.setItem("userToken", token);
  return { token, patient };
};

export const registerPatient = async (data: any): Promise<void> => {
  const response = await client.post("/patients", data);
  console.log("Registration response:", response.data);
};

export const fetchFullPatientProfile = async (token: string): Promise<Patient> => {
  const response = await client.get(`/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

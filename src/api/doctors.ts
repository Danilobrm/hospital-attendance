import { Doctor } from "../interfaces/doctor";
import { client } from "./api";

export const fetchDoctors = async (token: string): Promise<Doctor[]> => {
  const response = await client.get("/doctors", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchDoctorDetails = async (id: number, token: string): Promise<Doctor> => {
  const response = await client.get(`/doctors/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

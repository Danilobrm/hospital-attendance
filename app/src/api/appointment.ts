import { Appointment, AppointmentFilters, CreateAppointmentDto } from "../interfaces/appointment";
import { client } from "./api";

export const bookAppointment = async (
  token: string,
  appointmentData: CreateAppointmentDto,
  idempotencyKey: string
): Promise<Appointment> => {
  const response = await client.post("/appointments", appointmentData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "idempotency-key": idempotencyKey,
    },
  });
  return response.data;
};

export const fetchAppointments = async (token: string, filters: AppointmentFilters): Promise<Appointment[]> => {
  const response = await client.get(`/appointments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: filters,
  });
  return response.data;
};

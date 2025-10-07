export type AppointmentStatus = "CREATED" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface Appointment {
  id: number;
  scheduledAt: Date;
  notes?: string | null;
  status: AppointmentStatus;
  doctorId: number;
  doctorName?: string;
  doctorSpecialty?: string;
}

export interface CreateAppointmentDto {
  doctorId: number;
  patientId: number;
  scheduledAt: string;
  notes: string | null;
}

export interface AppointmentFilters {
  doctorId?: number;
  patientId?: number;
  status?: AppointmentStatus;
  from?: string; // Should be ISO date string (YYYY-MM-DD)
  to?: string; // Should be ISO date string (YYYY-MM-DD)
}

export class Appointment {
  id: number;
  patientName: string;
  patientEmail: string;
  doctorId: number;
  doctorName: string;
  doctorSpecialty?: string;
  scheduledAt: Date;
  notes?: string | null;
  status: 'CREATED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
}

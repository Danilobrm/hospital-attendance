export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  availableSlots: string[]; // ISO string dates
  isActive: boolean;
}
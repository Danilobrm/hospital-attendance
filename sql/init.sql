-- Create the AppointmentStatus enum
CREATE TYPE appointment_status AS ENUM ('CREATED', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ADMIN'
);

-- Create the Doctor table
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    "availableSlots" TEXT[] NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    role VARCHAR(50) NOT NULL DEFAULT 'DOCTOR'
);
CREATE INDEX idx_doctors_specialty ON doctors (specialty);
CREATE INDEX idx_doctors_is_active ON doctors ("isActive");

-- Create the Patient table
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "birthDate" TIMESTAMP NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'PATIENT'
);

-- Create the Appointment table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    "doctorId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    "scheduledAt" TIMESTAMP NOT NULL,
    status appointment_status NOT NULL DEFAULT 'CREATED',
    notes TEXT,
    FOREIGN KEY ("doctorId") REFERENCES doctors(id),
    FOREIGN KEY ("patientId") REFERENCES patients(id)
);
CREATE INDEX idx_appointments_doctor_id ON appointments ("doctorId");
CREATE INDEX idx_appointments_patient_id ON appointments ("patientId");
CREATE INDEX idx_appointments_status ON appointments (status);
CREATE INDEX idx_appointments_scheduled_at ON appointments ("scheduledAt");
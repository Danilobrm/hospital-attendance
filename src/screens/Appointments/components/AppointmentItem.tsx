import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import moment from "moment";
import { Appointment, AppointmentStatus } from "../../../interfaces/appointment";

interface AppointmentItemProps {
  appointment: Appointment;
}

const getStatusStyle = (status: AppointmentStatus) => {
  switch (status) {
    case "CONFIRMED":
      return { backgroundColor: "#d1fae5", color: "#059669" };
    case "CANCELLED":
      return { backgroundColor: "#fee2e2", color: "#ef4444" };
    case "COMPLETED":
      return { backgroundColor: "#e5e7eb", color: "#4b5563" };
    case "CREATED":
    default:
      return { backgroundColor: "#bfdbfe", color: "#1d4ed8" };
  }
};

export const AppointmentItem: React.FC<AppointmentItemProps> = ({ appointment }) => {
  const scheduledTime = moment(appointment.scheduledAt).format("MMM D, YYYY [at] h:mm A");
  const statusStyles = getStatusStyle(appointment.status);

  return (
    <TouchableOpacity style={itemStyles.card}>
      <View style={itemStyles.header}>
        <Text style={itemStyles.doctorName}>{appointment.doctorName}</Text>
        <Text
          style={[itemStyles.statusBadge, { backgroundColor: statusStyles.backgroundColor, color: statusStyles.color }]}
        >
          {appointment.status}
        </Text>
      </View>

      {appointment.doctorSpecialty && <Text style={itemStyles.specialty}>{appointment.doctorSpecialty}</Text>}

      <Text style={itemStyles.scheduledTime}>{scheduledTime}</Text>

      {!!appointment.notes && (
        <View style={itemStyles.notesContainer}>
          <Text style={itemStyles.notesText} numberOfLines={2}>
            Note: {appointment.notes}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// ... (itemStyles remains the same) ...
const itemStyles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    overflow: "hidden",
  },
  specialty: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  scheduledTime: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "500",
  },
  notesContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 8,
  },
  notesText: {
    fontSize: 14,
    color: "#4b5563",
    fontStyle: "italic",
  },
});

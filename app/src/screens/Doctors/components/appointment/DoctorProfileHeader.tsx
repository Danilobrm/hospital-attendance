import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { Doctor } from "../../../../interfaces/doctor";

interface DoctorProfileHeaderProps {
  doctor: Doctor;
  onClose: () => void;
}

export const DoctorProfileHeader: React.FC<DoctorProfileHeaderProps> = ({ doctor, onClose }) => (
  <View>
    <View style={styles.header}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeIcon}>X</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Details</Text>
      <View style={styles.closeButtonPlaceholder} />
    </View>

    <View style={styles.profileSection}>
      <Image source={{ uri: "doctor.imageUri" }} style={styles.profilePhoto} />
      <Text style={styles.doctorName}>{doctor.name}</Text>
      <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#3b82f6",
    paddingTop: 45,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#60a5fa",
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButtonPlaceholder: {
    width: 36,
  },

  // Profile Styles

  profileSection: {
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 8,
    borderBottomColor: "#f3f4f6",
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#3b82f6",
    backgroundColor: "#E0E0E0",
  },
  doctorName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  doctorSpecialty: {
    fontSize: 16,
    color: "#60a5fa",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#6b7280",
  },
  infoSeparator: {
    color: "#d1d5db",
    marginHorizontal: 8,
  },
  bioText: {
    fontSize: 14,
    color: "#4b5563",
    textAlign: "center",
    lineHeight: 20,
  },
});

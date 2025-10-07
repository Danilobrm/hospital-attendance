import { useQuery } from "@tanstack/react-query";
import { Text, View, FlatList, StyleSheet, StatusBar } from "react-native";
import { fetchDoctors } from "../../../api/doctors"; // Assumes this is correctly implemented
import { Doctor } from "../../../interfaces/doctor"; // Assumes this interface is correct
import { DoctorCard } from "./DoctorCard";
import { useAuth } from "../../../contexts/AuthContext";
import { DoctorCardSkeleton } from "./loading/DoctorCardSkeleton";

export const DoctorListScreen: React.FC = () => {
  const { token } = useAuth();

  const { data, isLoading, isError, error } = useQuery<Doctor[], Error>({
    queryKey: ["doctors"],
    queryFn: () => fetchDoctors(token!),
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
        <DoctorCardSkeleton />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-red-50 p-4">
        <Text className="text-xl font-bold text-red-700 mb-2">Error!</Text>
        <Text className="text-sm text-red-600 text-center">Failed to load doctors: {error.message}</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg text-gray-500">No doctors found.</Text>
      </View>
    );
  }

  // const mockDoctors: Doctor[] = [
  //   {
  //     id: 4,
  //     name: "Dr. John Doe",
  //     specialty: "Cardiology",
  //     availableSlots: ["2023-10-01T09:00:00Z", "2023-10-01T10:00:00Z"],
  //     isActive: true,
  //   },
  //   {
  //     id: 5,
  //     name: "Dr. Jane Smith",
  //     specialty: "Dermatology",
  //     availableSlots: ["2023-10-01T11:00:00Z", "2023-10-01T12:00:00Z"],
  //     isActive: true,
  //   },
  //   {
  //     id: 6,
  //     name: "Dr. Emily Johnson",
  //     specialty: "Pediatrics",
  //     availableSlots: ["2023-10-01T13:00:00Z", "2023-10-01T14:00:00Z"],
  //     isActive: false,
  //   },
  //   {
  //     id: 7,
  //     name: "Dr. Michael Brown",
  //     specialty: "Neurology",
  //     availableSlots: ["2023-10-01T15:00:00Z", "2023-10-01T16:00:00Z"],
  //     isActive: true,
  //   },
  //   {
  //     id: 8,
  //     name: "Dr. Sarah Davis",
  //     specialty: "Oncology",
  //     availableSlots: ["2023-10-01T17:00:00Z", "2023-10-01T18:00:00Z"],
  //     isActive: true,
  //   },
  // ].sort((a, b) => {
  //   if (a.isActive === b.isActive) {
  //     return a.id - b.id; // same isActive → sort by id
  //   }
  //   return Number(b.isActive) - Number(a.isActive);
  // });

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={[...data]}
        keyExtractor={(item: Doctor) => item.id.toString()}
        renderItem={({ item }) => <DoctorCard doctor={item} />}
      />
    </View>
  );
};

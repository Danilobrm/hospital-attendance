import React, { useState, useMemo, useEffect } from "react";
import { Text, View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { Appointment, AppointmentFilters, AppointmentStatus } from "../../interfaces/appointment";
import { AppointmentItem } from "./components/AppointmentItem";
import { TopBar } from "../../components/TopBar";
import { fetchAppointments } from "../../api/appointment";
import moment from "moment";
import { AppointmentItemSkeleton } from "./components/loading/AppointmentItemSkeleton";

const STATUS_OPTIONS: (AppointmentStatus | "ALL")[] = ["ALL", "CONFIRMED", "CREATED", "COMPLETED", "CANCELLED"];
const PERIOD_OPTIONS: ("UPCOMING" | "PAST" | "ALL")[] = ["UPCOMING", "PAST", "ALL"];

interface DoctorOption {
  id: number;
  name: string;
}

export const AppointmentsScreen: React.FC = () => {
  const { patient, token } = useAuth();

  const [filterDoctorId, setFilterDoctorId] = useState<number | "ALL">("ALL");
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | "ALL">("ALL");
  const [filterPeriod, setFilterPeriod] = useState<"UPCOMING" | "PAST" | "ALL">("UPCOMING");

  const [allDoctors, setAllDoctors] = useState<DoctorOption[]>([]);

  const filters: AppointmentFilters = useMemo(() => {
    let fromDate: string | undefined;
    let toDate: string | undefined;
    const now = moment().toISOString();

    if (filterPeriod === "UPCOMING") {
      fromDate = now;
      toDate = undefined;
    } else if (filterPeriod === "PAST") {
      fromDate = undefined;
      toDate = now;
    }

    const filtersToSend: AppointmentFilters = {
      patientId: patient?.id,
      doctorId: filterDoctorId !== "ALL" ? Number(filterDoctorId) : undefined,
      status: filterStatus !== "ALL" ? filterStatus : undefined,
      from: fromDate,
      to: toDate,
    };

    Object.keys(filtersToSend).forEach((key) => {
      const value = (filtersToSend as any)[key];
      if (value === undefined || value === null) {
        delete (filtersToSend as any)[key];
      }
    });

    return filtersToSend;
  }, [filterStatus, filterPeriod, filterDoctorId, patient?.id]);

  const {
    data: appointments,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Appointment[], Error>({
    queryKey: ["appointments", patient?.id, filters],
    queryFn: () => fetchAppointments(token!, filters),
    enabled: !!patient?.id && !!token,
  });

  useEffect(() => {
    if (appointments) {
      const currentDoctorsMap = new Map<number, DoctorOption>();
      appointments
        .filter((a) => a.doctorId !== undefined && a.doctorName)
        .forEach((a) => {
          if (a.doctorId) {
            currentDoctorsMap.set(a.doctorId, {
              id: a.doctorId,
              name: a.doctorName as string,
            });
          }
        });

      const uniqueDoctorsFromCurrentFetch = Array.from(currentDoctorsMap.values());

      setAllDoctors((prevDoctors) => {
        const all = new Map(prevDoctors.map((d) => [d.id, d]));

        uniqueDoctorsFromCurrentFetch.forEach((newDoc) => {
          if (!all.has(newDoc.id)) {
            all.set(newDoc.id, newDoc);
          }
        });

        return Array.from(all.values());
      });
    }
  }, [appointments]);

  const doctorOptionsForUI = useMemo(() => {
    const allOption: { id: "ALL"; name: "All Doctors" } = { id: "ALL", name: "All Doctors" };
    const sortedDoctors = allDoctors.sort((a, b) => a.name.localeCompare(b.name));
    return [allOption, ...sortedDoctors];
  }, [allDoctors]);

  const renderDoctorFilterItem = ({ item }: { item: DoctorOption | { id: "ALL"; name: "All Doctors" } }) => {
    const isSelected = filterDoctorId === item.id;
    return (
      <TouchableOpacity
        style={[styles.statusButton, isSelected && styles.statusButtonActive]}
        onPress={() => setFilterDoctorId(item.id as number | "ALL")}
      >
        <Text style={[styles.statusText, isSelected && styles.statusTextActive]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderStatusFilterItem = ({ item: status }: { item: AppointmentStatus | "ALL" }) => {
    const isSelected = filterStatus === status;
    return (
      <TouchableOpacity
        key={status}
        style={[styles.statusButton, isSelected && styles.statusButtonActive]}
        onPress={() => setFilterStatus(status)}
      >
        <Text style={[styles.statusText, isSelected && styles.statusTextActive]}>{status}</Text>
      </TouchableOpacity>
    );
  };

  const renderPeriodFilterItem = ({ item: period }: { item: "UPCOMING" | "PAST" | "ALL" }) => {
    const isSelected = filterPeriod === period;
    return (
      <TouchableOpacity
        key={period}
        style={[styles.statusButton, isSelected && styles.statusButtonActive]}
        onPress={() => setFilterPeriod(period)}
      >
        <Text style={[styles.statusText, isSelected && styles.statusTextActive]}>{period}</Text>
      </TouchableOpacity>
    );
  };

  const renderAppointmentItem = ({ item }: { item: Appointment }) => <AppointmentItem appointment={item} />;

  if (!patient?.id || !token) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please log in to view your appointments.</Text>
      </View>
    );
  }

  const ListHeaderComponent = () => (
    <View>
      <Text style={styles.headerTitle}>Your Appointments</Text>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Doctor:</Text>
        <FlatList
          data={doctorOptionsForUI}
          renderItem={renderDoctorFilterItem}
          keyExtractor={(item) => String(item.id)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusListContent}
        />
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Date Range:</Text>
        <FlatList
          data={PERIOD_OPTIONS}
          renderItem={renderPeriodFilterItem}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusListContent}
        />
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Status:</Text>
        <FlatList
          data={STATUS_OPTIONS}
          renderItem={renderStatusFilterItem}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusListContent}
        />
      </View>
    </View>
  );

  const ListEmptyComponent = () => {
    if (isError) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No appointments found.</Text>
        <Text style={styles.emptySubText}>Try widening your filters.</Text>
      </View>
    );
  };

  if (isError && !isLoading) {
    console.error("Error fetching appointments:", error);
    return (
      <View style={styles.container}>
        <TopBar />
        <ListHeaderComponent />
        <Text style={styles.errorText}>Failed to load appointments. Please try again.</Text>
      </View>
    );
  }

  const dataToRender = isLoading && !appointments ? [] : appointments;
  const isRefreshing = isLoading && appointments;

  const RenderListContent = () => {
    if (isLoading && !appointments) {
      return (
        <View style={{ flex: 1, paddingTop: 10 }}>
          <AppointmentItemSkeleton />
          <AppointmentItemSkeleton />
          <AppointmentItemSkeleton />
        </View>
      );
    }

    return (
      <FlatList
        data={dataToRender}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isRefreshing}
        ListEmptyComponent={ListEmptyComponent}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TopBar />
      <ListHeaderComponent />
      <RenderListContent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 0,
    marginTop: 10,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  filterLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
    fontWeight: "600",
  },
  statusListContent: {
    paddingRight: 16,
    paddingBottom: 5,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  statusButtonActive: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  statusText: {
    fontSize: 14,
    color: "#4b5563",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  statusTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6b7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 150,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: 5,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 16,
    color: "#9ca3af",
  },
  errorText: {
    padding: 20,
    textAlign: "center",
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
  },
});

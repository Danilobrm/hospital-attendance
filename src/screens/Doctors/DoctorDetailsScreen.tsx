import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { DoctorProfileHeader } from "./components/appointment/DoctorProfileHeader";
import { TimeSlotGrid } from "./components/appointment/TimeSlotGrid";
import { Doctor } from "../../interfaces/doctor";
import moment from "moment";
import { fetchDoctorDetails } from "../../api/doctors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HorizontalMonthPicker } from "./components/appointment/date-picker/HorizontalMonthPicker";
import { bookAppointment } from "../../api/appointment";
import { useAuth } from "../../contexts/AuthContext";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { CreateAppointmentDto } from "../../interfaces/appointment";
import { DoctorDetailsSkeleton } from "./loading/DoctorDetailsSkeleton";

export const DoctorDetails: React.FC<any> = ({ navigation, route }) => {
  const doctorId = route.params.doctor?.id;
  const { patient, token } = useAuth();
  const [bookingKey, setBookingKey] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [targetMonth, setTargetMonth] = useState(moment().startOf("month"));
  const [patientNote, setPatientNote] = useState<string>("");
  const [localDisplayError, setLocalDisplayError] = useState("");

  const queryClient = useQueryClient();

  const {
    data: doctor,
    isLoading,
    isError,
    error,
  } = useQuery<Doctor, Error>({
    queryKey: ["doctorDetails", doctorId],
    queryFn: () => fetchDoctorDetails(doctorId, token!),
    enabled: !!doctorId,
  });

  const handleSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["doctorDetails", doctorId] });
    setLocalDisplayError("");
    setSelectedDate("");
    setSelectedTimeSlot(null);
    setPatientNote("");
    setBookingKey(null);
    navigation.goBack();
  }, []);

  const handleError = useCallback((error: { response?: any; request?: any; message?: string }) => {
    if (error.response) {
      const message = error.response.data?.message || error.response.data || "Unknown error";
      setLocalDisplayError(message);
    } else if (error.request) {
      setLocalDisplayError("No response from server");
    } else {
      setLocalDisplayError(error.message ?? "Unknown error");
    }
  }, []);

  const bookAppointmentMutation = useMutation({
    mutationFn: ({ data, key }: { data: CreateAppointmentDto; key: string }) => bookAppointment(token!, data, key),
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const handleBookAppointment = () => {
    if (selectedTimeSlot && doctor && selectedDate) {
      const m = moment(`${selectedDate} ${selectedTimeSlot}`, "YYYY-MM-DD hh:mm A")
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss[Z]");

      const selectedISO = m.toString();

      const appointmentData = {
        doctorId: doctor.id,
        patientId: patient?.id!,
        scheduledAt: selectedISO,
        notes: patientNote.trim() || null,
      };

      bookAppointmentMutation.mutate({ data: appointmentData, key: idempotencyKey });
    }
  };

  const idempotencyKey = useMemo(() => {
    if (!bookingKey) {
      const newKey = uuidv4();
      setBookingKey(newKey);
      return newKey;
    }
    return bookingKey;
  }, [bookingKey]);

  const firstAvailableDateKey = useMemo(() => {
    if (!doctor?.availableSlots || doctor.availableSlots.length === 0) {
      return null;
    }

    const today = moment().startOf("day");

    const earliestFutureSlot = doctor.availableSlots
      .map((slot) => moment(slot))
      .filter((m) => m.isSameOrAfter(today))
      .sort((a, b) => a.valueOf() - b.valueOf())[0];

    return earliestFutureSlot ? earliestFutureSlot.format("YYYY-MM-DD") : null;
  }, [doctor]);

  const initialScrollDateKey = useMemo(() => {
    if (firstAvailableDateKey) {
      return firstAvailableDateKey;
    }
    // If no future slots, scroll/focus on the current day.
    return moment().format("YYYY-MM-DD");
  }, [firstAvailableDateKey]);

  // 3. Update the useEffect to implement the "select only if available" rule
  useEffect(() => {
    if (!selectedDate && initialScrollDateKey) {
      if (firstAvailableDateKey) {
        console.log("Auto-selecting first available date:", firstAvailableDateKey);
        setSelectedDate(firstAvailableDateKey);
      } else {
        console.log("No future slots available. Focusing on current date but leaving selection empty.");
        setSelectedDate(""); // Explicitly keep it empty
      }
    }
  }, [initialScrollDateKey, selectedDate, firstAvailableDateKey]);

  const handleSelectDate = useCallback((dateKey: string) => {
    setSelectedDate(dateKey);
    setSelectedTimeSlot(null);
  }, []);

  const handleNavigateMonth = useCallback((direction: "prev" | "next") => {
    setTargetMonth((prevMonth) => prevMonth.clone().add(direction === "next" ? 1 : -1, "month"));
    setSelectedTimeSlot(null);
    setSelectedDate("");
  }, []);

  const availableSlotsForDay = useMemo(() => {
    if (!doctor || !selectedDate) return [];

    return doctor.availableSlots.filter((slot) => moment(slot).format("YYYY-MM-DD") === selectedDate);
  }, [doctor, selectedDate]);

  if (isLoading) {
    return <DoctorDetailsSkeleton />;
  }

  if (isError || !doctor) {
    const errorMessage = isError ? error!.message : "Doctor not found or invalid ID.";
    return (
      <View style={styles.container}>
        <Text style={{ padding: 20, textAlign: "center", color: "red" }}>{errorMessage}</Text>
      </View>
    );
  }

  const currentError = localDisplayError || bookAppointmentMutation.error;

  return (
    <View style={styles.container}>
      <DoctorProfileHeader doctor={doctor} onClose={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <HorizontalMonthPicker
            slots={doctor.availableSlots}
            targetMonth={targetMonth}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            onNavigateMonth={handleNavigateMonth}
            initialScrollDate={initialScrollDateKey}
          />

          {selectedDate && moment(selectedDate).isSame(targetMonth, "month") ? (
            <>
              <TimeSlotGrid
                slots={availableSlotsForDay}
                selectedTime={selectedTimeSlot}
                onSelectTime={setSelectedTimeSlot}
              />

              <View style={styles.noteContainer}>
                <Text style={styles.noteHeader}>Add a Note for the Doctor (Optional)</Text>
                <TextInput
                  editable={!!selectedTimeSlot && !!selectedDate}
                  style={styles.noteInput}
                  multiline
                  numberOfLines={4}
                  placeholder="E.g., I need a follow-up for my blood pressure check. I'll bring my past lab results."
                  value={patientNote}
                  onChangeText={setPatientNote}
                  textAlignVertical="top"
                />
              </View>
            </>
          ) : (
            <Text style={styles.noSlotsGlobal}>
              {selectedDate
                ? "Please select a date in the current month."
                : "No future appointments available for this doctor. Please check next month or select a date."}
            </Text>
          )}
        </ScrollView>

        {currentError ? (
          <Text style={styles.errorText}>
            {typeof currentError === "string"
              ? currentError
              : (currentError as any) instanceof Error
                ? (currentError as Error).message
                : ""}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.bookButton, !selectedTimeSlot && styles.bookButtonDisabled]}
            onPress={handleBookAppointment}
            disabled={!selectedTimeSlot}
          >
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  noSlotsGlobal: {
    padding: 20,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 16,
    marginTop: 30,
  },
  noteContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  noteHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
  },
  noteInput: {
    minHeight: 100,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9fafb",
  },
  footer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  bookButton: {
    height: 50,
    backgroundColor: "#10b981",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  bookButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "500",
  },
});

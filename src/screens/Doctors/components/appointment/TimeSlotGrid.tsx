import moment from "moment";
import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList, Dimensions } from "react-native";

interface Slot {
  date: string; // e.g., "2025-10-28T14:00:00Z"
  time: string; // e.g., "02:00 PM"
}

interface TimeSlotGridProps {
  slots: string[]; // Raw ISO strings for the selected day
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({ slots, selectedTime, onSelectTime }) => {
  // Format the raw slots into displayable times
  const displaySlots: Slot[] = slots.map((slot) => ({
    date: slot,
    time: moment(slot).format("h:mm A"), // e.g., "9:00 AM"
  }));

  return (
    <View>
      <Text style={styles.sectionTitle}>Available Times</Text>
      <View style={styles.timeSlotGrid}>
        {displaySlots.length > 0 ? (
          displaySlots.map((slot) => (
            <TouchableOpacity
              key={slot.time}
              style={[styles.timeSlotButton, selectedTime === slot.time && styles.timeSlotSelected]}
              onPress={() => onSelectTime(slot.time)}
            >
              <Text style={[styles.timeSlotText, selectedTime === slot.time && styles.timeSlotTextSelected]}>
                {slot.time}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noSlotsText}>No slots available for this date.</Text>
        )}
      </View>
    </View>
  );
};


const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  // Header Styles

  // Time Slot Styles
  timeSlotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingTop: 5,
    justifyContent: "flex-start",
  },
  timeSlotButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#60a5fa",
    backgroundColor: "#fff",
  },
  timeSlotSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  timeSlotText: {
    color: "#3b82f6",
    fontWeight: "600",
    fontSize: 14,
  },
  timeSlotTextSelected: {
    color: "#fff",
  },
  noSlotsText: {
    padding: 10,
    color: "#9ca3af",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
});

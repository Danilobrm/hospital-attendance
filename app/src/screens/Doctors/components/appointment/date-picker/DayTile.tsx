// DayTile.tsx (Helper Component)
import React, { memo } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import moment from "moment";

// Constants and styles are defined here for self-containment
const DAY_WIDTH = 65;
const DAY_MARGIN_RIGHT = 10;
const ITEM_LENGTH = DAY_WIDTH + DAY_MARGIN_RIGHT;

interface DayItem {
  dateKey: string;
  dayOfWeek: string;
  dayOfMonth: number;
  isAvailable: boolean;
}

interface DayTileProps {
  day: DayItem;
  isSelected: boolean;
  onPress: (key: string) => void;
}

export const DayTile: React.FC<DayTileProps> = memo(({ day, isSelected, onPress }) => {
  const isDisabled = !day.isAvailable;
  const isToday = day.dateKey === moment().format("YYYY-MM-DD");

  const tileStyle = [
    styles.daySlot,
    isDisabled ? styles.daySlotDisabled : styles.daySlotDefault,
    isSelected && styles.daySlotSelected,
    isToday && styles.daySlotToday,
  ];

  const textStyle = [
    styles.dateText,
    isDisabled ? styles.dateTextDisabled : styles.dateTextDefault,
    isSelected && styles.dateTextSelected,
  ];

  const dayOfWeekStyle = [
    styles.dayText,
    isDisabled ? styles.dayTextDisabled : styles.dayTextDefault,
    isSelected && styles.dayTextSelected,
  ];

  return (
    <TouchableOpacity style={tileStyle} onPress={() => onPress(day.dateKey)} disabled={isDisabled}>
      <Text style={dayOfWeekStyle}>{day.dayOfWeek}</Text>
      <Text style={textStyle}>{day.dayOfMonth}</Text>
    </TouchableOpacity>
  );
});

export const styles = StyleSheet.create({
  daySlot: {
    width: DAY_WIDTH,
    height: 75,
    borderRadius: 8,
    marginRight: DAY_MARGIN_RIGHT,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  daySlotDefault: {
    backgroundColor: "#f9fafb",
    borderColor: "#e5e7eb",
  },
  daySlotSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  daySlotDisabled: {
    backgroundColor: "#f9fafb",
    borderColor: "#f3f4f6",
    opacity: 0.7,
  },
  daySlotToday: {
    borderWidth: 2,
    borderColor: "#10b981",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
  },
  dayTextDefault: {
    color: "#4b5563",
  },
  dayTextSelected: {
    color: "#fff",
  },
  dayTextDisabled: {
    color: "#9ca3af",
  },
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 2,
  },
  dateTextDefault: {
    color: "#1f2937",
  },
  dateTextSelected: {
    color: "#fff",
  },
  dateTextDisabled: {
    color: "#9ca3af",
  },
  horizontalListContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  sectionTitle: {
    // Kept for the month header text style
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
  },
});

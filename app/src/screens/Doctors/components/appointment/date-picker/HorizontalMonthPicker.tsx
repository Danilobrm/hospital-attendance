// HorizontalMonthPicker.tsx (Modified)
import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import moment from "moment";
import { HorizontalDateList } from "./HorizontalDateList";
import { styles } from "./DayTile"; // Assuming this is where sectionTitle style is defined

interface DayItem {
  dateKey: string;
  dayOfWeek: string;
  dayOfMonth: number;
  isAvailable: boolean;
}

interface HorizontalMonthPickerProps {
  slots: string[];
  targetMonth: moment.Moment;
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
  onNavigateMonth: (direction: "prev" | "next") => void;
  initialScrollDate: string;
}

export const HorizontalMonthPicker: React.FC<HorizontalMonthPickerProps> = ({
  slots,
  targetMonth,
  selectedDate,
  onSelectDate,
  onNavigateMonth,
  initialScrollDate,
}) => {
  const availableDates = useMemo(() => {
    return new Set(slots.map((slot) => moment(slot).format("YYYY-MM-DD")));
  }, [slots]);

  const monthDays: DayItem[] = useMemo(() => {
    const days: DayItem[] = [];
    const startOfMonth = targetMonth.clone().startOf("month");
    const numDaysInMonth = targetMonth.daysInMonth();
    const now = moment().startOf("day"); // Use start of day for comparison

    for (let i = 0; i < numDaysInMonth; i++) {
      const date = startOfMonth.clone().add(i, "days");
      const dateKey = date.format("YYYY-MM-DD");

      // Check if the date is strictly before today (i.e., in the past)
      const isPast = date.isBefore(now, "day");
      const isAvailable = availableDates.has(dateKey) && !isPast;

      days.push({
        dateKey,
        dayOfWeek: date.format("ddd"),
        dayOfMonth: date.date(),
        isAvailable,
      });
    }
    return days;
  }, [targetMonth, availableDates]);

  // **********************************************
  // ** NEW LOGIC TO CHECK AVAILABLE MONTHS **
  // **********************************************

  // Check if any available slot falls in the next month
  const slotsInNextMonth = useMemo(() => {
    const nextMonth = targetMonth.clone().add(1, "month");
    return slots.some((slot) => moment(slot).isSame(nextMonth, "month"));
  }, [slots, targetMonth]);

  // Check if any available slot falls in the previous month
  const slotsInPrevMonth = useMemo(() => {
    // Prevent navigating to months completely in the past
    const startOfCurrentMonth = moment().startOf("month");
    const prevMonth = targetMonth.clone().subtract(1, "month");

    // Only allow navigation to a previous month if it's the current month or later
    if (prevMonth.isBefore(startOfCurrentMonth, "month")) {
      return false;
    }

    return slots.some((slot) => moment(slot).isSame(prevMonth, "month"));
  }, [slots, targetMonth]);
  // **********************************************
  // **********************************************

  // Determine if the previous button should be disabled
  const isPrevDisabled = !slotsInPrevMonth;

  // Determine if the next button should be disabled
  const isNextDisabled = !slotsInNextMonth;

  return (
    <View style={pickerStyles.monthPickerContainer}>
      <View style={pickerStyles.monthHeader}>
        <TouchableOpacity
          onPress={() => onNavigateMonth("prev")}
          style={pickerStyles.navButton}
          disabled={isPrevDisabled} // Disable if no slots found
        >
          <Text style={[pickerStyles.navIcon, isPrevDisabled && pickerStyles.navIconDisabled]}>{"<"}</Text>
        </TouchableOpacity>

        <Text style={pickerStyles.monthTitle}>{targetMonth.format("MMMM YYYY")}</Text>

        <TouchableOpacity
          onPress={() => onNavigateMonth("next")}
          style={pickerStyles.navButton}
          disabled={isNextDisabled} // Disable if no slots found
        >
          <Text style={[pickerStyles.navIcon, isNextDisabled && pickerStyles.navIconDisabled]}>{">"}</Text>
        </TouchableOpacity>
      </View>

      <HorizontalDateList
        monthDays={monthDays}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        initialScrollDate={initialScrollDate}
        targetMonth={targetMonth}
      />
    </View>
  );
};

// --- Updated Styles for Month Navigation ---
const pickerStyles = StyleSheet.create({
  monthPickerContainer: {},
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827", // Using a dark color for visibility
  },
  navButton: {
    padding: 10,
  },
  navIcon: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3b82f6", // Blue color for active button
  },
  navIconDisabled: {
    color: "#ccc", // Gray color for disabled button
  },
});

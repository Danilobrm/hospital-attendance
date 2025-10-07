// loading/DoctorDetailsSkeleton.tsx
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const SkeletonBlock: React.FC<{ width: string | number; height: number; style?: object }> = ({
  width,
  height,
  style,
}) => <View style={[skeletonStyles.skeletonBlock, { width, height }, style]} />;

export const DoctorDetailsSkeleton: React.FC = () => (
  <View style={skeletonStyles.container}>
    <View style={skeletonStyles.header}>
      <SkeletonBlock width={20} height={20} style={skeletonStyles.closeIcon} />
      <SkeletonBlock width={80} height={20} style={{ marginHorizontal: "auto" }} />
      <View style={skeletonStyles.closeIcon} />
    </View>

    <View style={skeletonStyles.profileSection}>
      <SkeletonBlock width={100} height={100} style={skeletonStyles.profilePhoto} />
      <SkeletonBlock width="50%" height={24} style={skeletonStyles.doctorName} />
      <SkeletonBlock width="30%" height={16} style={skeletonStyles.doctorSpecialty} />
    </View>

    <View style={skeletonStyles.datePickerContainer}>
      <View style={skeletonStyles.monthHeader}>
        <SkeletonBlock width={20} height={20} style={skeletonStyles.navIcon} />
        <SkeletonBlock width="35%" height={18} style={{ marginHorizontal: 10 }} />
        <SkeletonBlock width={20} height={20} style={skeletonStyles.navIcon} />
      </View>

      <View style={skeletonStyles.horizontalListContainer}>
        {[...Array(5)].map((_, i) => (
          <View key={i} style={skeletonStyles.daySlot}>
            <SkeletonBlock width={30} height={14} style={{ marginBottom: 4 }} />
            <SkeletonBlock width={30} height={20} style={{ marginTop: 2 }} />
          </View>
        ))}
      </View>
    </View>

    {/* 3. Time Slot Grid Skeleton */}

    {/* Mimic Section Title: Available Times */}
    <View style={skeletonStyles.timeSlotHeader}>
      <SkeletonBlock width="40%" height={18} />
    </View>

    {/* Simulated Time Slot Grid (Mimics TimeSlotGrid styles) */}
    <View style={skeletonStyles.timeSlotGrid}>
      {[...Array(6)].map((_, i) => (
        <SkeletonBlock
          key={i}
          width={80} // Approx width of time slot button
          height={40}
          style={skeletonStyles.timeSlotButton}
        />
      ))}
    </View>

    {/* 4. Note Section Skeleton */}
    <View style={skeletonStyles.noteContainer}>
      <SkeletonBlock width="60%" height={16} style={skeletonStyles.noteHeader} />
      <SkeletonBlock width="100%" height={100} style={skeletonStyles.noteInput} />
    </View>

    {/* 5. Footer (Book Button) Skeleton */}
    <View style={skeletonStyles.footer}>
      <SkeletonBlock width="100%" height={50} style={skeletonStyles.bookButton} />
    </View>
  </View>
);

const skeletonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  skeletonBlock: {
    backgroundColor: "#e0e0e0", // Base gray for skeleton elements
    borderRadius: 4,
    overflow: "hidden",
  },
  // --- Profile Header Styles ---
  header: {
    // Mimics outer header (blue bar)
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#3b82f6",
    paddingTop: 45,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  closeIcon: {
    width: 20,
    height: 20,
    backgroundColor: "transparent",
  },
  profileSection: {
    // Mimics profile section (white background)
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
    borderBottomWidth: 8,
    borderBottomColor: "#f3f4f6",
  },
  profilePhoto: {
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#3b82f6", // Use the accent color for the border effect
  },
  doctorName: {
    marginVertical: 4,
  },
  doctorSpecialty: {
    marginTop: 4,
  },

  // --- Date Picker Styles (HorizontalMonthPicker) ---
  datePickerContainer: {
    backgroundColor: "#fff",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  navIcon: {
    backgroundColor: "transparent", // Simulate TouchableOpacity
    borderRadius: 0,
  },
  horizontalListContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  daySlot: {
    // Mimics DayTile structure (60px width + margin)
    width: 60,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  // --- Time Slot & Note Styles ---
  timeSlotHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  timeSlotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingTop: 5,
  },
  timeSlotButton: {
    // Mimics TimeSlotGrid button style
    margin: 5,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  noteContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  noteHeader: {
    marginBottom: 8,
  },
  noteInput: {
    borderRadius: 10,
    backgroundColor: "#f9fafb",
    borderColor: "#e5e7eb",
    borderWidth: 1,
  },
  // --- Footer Styles ---
  footer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  bookButton: {
    borderRadius: 10,
    backgroundColor: "#ccc", // Disabled color for loading
  },
});

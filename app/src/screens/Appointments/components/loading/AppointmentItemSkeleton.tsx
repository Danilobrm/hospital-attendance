import React from "react";
import { View, StyleSheet } from "react-native";

const SKELETON_COUNT = 4;

const SkeletonBlock: React.FC<{ width: string | number; height: number; style?: object }> = ({
  width,
  height,
  style,
}) => <View style={[skeletonStyles.skeletonBlock, { width, height }, style]} />;

export const AppointmentItemSkeleton: React.FC = () => (
  <View>
    {[...Array(SKELETON_COUNT)].map((_, index) => (
      <View key={index} style={itemStyles.card}>
        {/* Header Skeleton (Doctor Name and Status Badge) */}
        <View style={itemStyles.header}>
          {/* Doctor Name */}
          <SkeletonBlock width="55%" height={18} style={itemStyles.doctorName} />
          {/* Status Badge */}
          <SkeletonBlock width={65} height={20} style={itemStyles.statusBadge} />
        </View>

        {/* Specialty Skeleton */}
        <SkeletonBlock width="40%" height={14} style={itemStyles.specialty} />

        {/* Scheduled Time */}
        <SkeletonBlock width="70%" height={15} style={itemStyles.scheduledTime} />

        {/* Notes Container Skeleton (Simulated presence) */}
        {index % 2 === 0 && (
          <View style={itemStyles.notesContainer}>
            {/* Note Line 1 */}
            <SkeletonBlock width="90%" height={14} style={skeletonStyles.noteLine} />
            {/* Note Line 2 (Shorter) */}
            <SkeletonBlock width="60%" height={14} style={skeletonStyles.noteLine} />
          </View>
        )}
      </View>
    ))}
  </View>
);

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
    // Used for vertical alignment
  },
  statusBadge: {
    borderRadius: 15,
  },
  specialty: {
    marginBottom: 8,
  },
  scheduledTime: {
    // Used for vertical alignment
  },
  notesContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 8,
  },
  notesText: {
    // Not used directly, but spacing is needed
  },
});

const skeletonStyles = StyleSheet.create({
  skeletonBlock: {
    backgroundColor: "#e0e0e0", // Base gray for skeleton elements
    borderRadius: 4,
    marginVertical: 2, // Small vertical spacing for text lines
  },
  noteLine: {
    marginVertical: 2,
    height: 14, // Matches font size height
  },
});

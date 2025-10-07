import React from "react";
import { View, StyleSheet, Platform, StyleProp, ViewStyle } from "react-native";
import { cardStyles } from "../DoctorCard";

const SkeletonBlock: React.FC<{ width: string | number; height: number; style?: object }> = ({
  width,
  height,
  style,
}) => <View style={[skeletonStyles.skeletonBlock, { width, height }, style]} />;

const SKELETON_COUNT = 5;

export const DoctorCardSkeleton: React.FC = () => (
  <View style={skeletonStyles.listContainer}>
    {[...Array(SKELETON_COUNT)].map((_, index) => (
      <View key={index} style={cardStyles.card as StyleProp<ViewStyle>}>
        <View style={cardStyles.contentRow}>
          <View style={cardStyles.detailsContainer}>
            <View style={cardStyles.imageContainer}>
              <SkeletonBlock width="100%" height="100%" style={skeletonStyles.photo} />
            </View>

            <View style={cardStyles.textContainer}>
              <SkeletonBlock width="85%" height={16} style={[cardStyles.nameText, { marginBottom: 4 }]} />

              <SkeletonBlock width="50%" height={13} style={cardStyles.specialtyText} />
            </View>
          </View>

          <View style={cardStyles.statusSlotContainer}>
            <View style={cardStyles.statusRow}>
              <SkeletonBlock width={55} height={12} style={{ marginRight: 4, borderRadius: 2 }} />
              <SkeletonBlock width={10} height={10} style={{ borderRadius: 5 }} />
            </View>

            {index % 2 === 0 && (
              <SkeletonBlock
                width={70}
                height={20}
                style={[cardStyles.slotDetails, { backgroundColor: "#e0e0e0", marginTop: 4, padding: 0 }]}
              />
            )}
          </View>
        </View>
      </View>
    ))}
  </View>
);

const skeletonStyles = StyleSheet.create({
  listContainer: {
    paddingVertical: 8,
  },
  skeletonBlock: {
    backgroundColor: "#e0e0e0", // Base gray for all skeleton elements
    borderRadius: 4,
  },
  photo: {
    backgroundColor: "#C0C0C0", // Slightly darker gray for the circular avatar
    borderRadius: 30, // Matches the border radius of the image container
  },
  // Ensure we reuse existing styles to maintain layout integrity
  nameText: {
    marginTop: 0,
    marginBottom: 4,
  },
  specialtyText: {
    marginTop: 0,
    marginBottom: 0,
  },
  // We use cardStyles directly for structural elements like card, contentRow, etc.
});

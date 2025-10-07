import React from "react";
import { Text, View, Image, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, Platform } from "react-native";
import { Doctor } from "../../../interfaces/doctor";
import { useNavigation } from "@react-navigation/native";

const formatSlot = (isoString: string) =>
  new Date(isoString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

export const DoctorCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  const navigation = useNavigation<any>();
  const isDisabled = !doctor.isActive;

  const disabledStyle: StyleProp<ViewStyle> = isDisabled ? cardStyles.cardDisabled : {};

  const handlePress = () => {
    if (!isDisabled) {
      navigation.navigate("DoctorDetails", { doctor });
    }
  };

  return (
    <TouchableOpacity style={[cardStyles.card, disabledStyle]} onPress={handlePress} disabled={isDisabled}>
      <View style={cardStyles.contentRow}>
        <View style={cardStyles.detailsContainer}>
          <View style={cardStyles.imageContainer}>
            <Image
              source={{
                uri: "https://via.placeholder.com/150", // mock image
              }}
              style={cardStyles.photo}
              resizeMode="cover"
            />
          </View>

          <View style={cardStyles.textContainer}>
            <Text style={cardStyles.nameText} numberOfLines={1}>
              {doctor.name}
            </Text>
            <Text style={cardStyles.specialtyText} numberOfLines={1}>
              {doctor.specialty}
            </Text>
          </View>
        </View>

        <View style={cardStyles.statusSlotContainer}>
          <View style={cardStyles.statusRow}>
            <Text
              style={[cardStyles.statusText, doctor.isActive ? cardStyles.statusActive : cardStyles.statusInactive]}
            >
              {doctor.isActive ? "Available" : "Inactive"}
            </Text>
            <Text style={cardStyles.dotIcon}>{doctor.isActive ? "🟢" : "🔴"}</Text>
          </View>

          {/* Next Available Slot (Uncommented and improved) */}
          {/* {doctor.availableSlots.length > 0 && doctor.isActive && (
            <View style={cardStyles.slotDetails}>
              <Text style={cardStyles.slotTimeLabel}>Next:</Text>
              <Text style={cardStyles.slotTime}>{formatSlot(doctor.availableSlots[0]).split(",")[1].trim()}</Text>
            </View>
          )} */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cardDisabled: {
    opacity: 0.6,
    backgroundColor: "#F5F5F5",
  },
  contentRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 3,
    marginRight: 10,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginRight: 12,
  },
  photo: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E0E0E0",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 2,
  },
  specialtyText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#757575",
  },

  // --- Right Section (Status and Slot) ---
  statusSlotContainer: {
    alignItems: "flex-end", // Align items to the right side of this container
    flex: 1.5, // Dedicated space for status/slot
  },

  // Status Indicator Row
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginRight: 4,
  },
  statusActive: {
    color: "#4CAF50", // Green for Available
  },
  statusInactive: {
    color: "#F44336", // Red for Inactive
  },
  dotIcon: {
    fontSize: 10, // A smaller size for the emoji/dot
  },

  // Next Available Slot Details
  slotDetails: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD", // Light blue background for slot
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  slotTimeLabel: {
    fontSize: 12,
    color: "#1976D2", // Darker blue text
    fontWeight: "500",
    marginRight: 4,
  },
  slotTime: {
    fontSize: 13,
    color: "#1976D2",
    fontWeight: "700",
  },
});

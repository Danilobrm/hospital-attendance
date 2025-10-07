// import { useMemo } from "react";
// import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import moment from "moment";
// 
// interface DaySlotProps {
//   day: { dateKey: string; dayOfWeek: string; dayOfMonth: number }; // Corrected interface to match structure
//   isSelected: boolean;
//   onSelect: () => void;
// }
// 
// const DaySlot: React.FC<DaySlotProps> = ({ day, isSelected, onSelect }) => (
//   <TouchableOpacity
//     style={[styles.daySlot, isSelected ? styles.daySlotSelected : styles.daySlotDefault]}
//     onPress={onSelect}
//   >
//     <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>{day.dayOfWeek}</Text>
//     {/* Displaying the day of the month */}
//     <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>{day.dayOfMonth}</Text>
//   </TouchableOpacity>
// );
// 
// interface AppointmentDatePickerProps {
//   slots: string[];
//   selectedDate: string;
//   onSelectDate: (dateKey: string) => void;
// }
// 
// export const AppointmentDatePicker: React.FC<AppointmentDatePickerProps> = ({ slots, selectedDate, onSelectDate }) => {
//   const availableDateKeys = useMemo(() => {
//     return Array.from(new Set(slots.map((slot) => moment(slot).format("YYYY-MM-DD"))));
//   }, [slots]);
// 
//   const dateOptions = useMemo(() => {
//     return availableDateKeys.map((dateKey) => {
//       const date = moment(dateKey);
//       return {
//         dateKey,
//         dayOfWeek: date.format("ddd"), 
//         dayOfMonth: date.date(),
//         month: date.format("MMM"), 
//       };
//     });
//   }, [availableDateKeys]);
// 
//   const displayMonth = useMemo(() => {
//     if (selectedDate) {
//       return moment(selectedDate).format("MMMM YYYY");
//     }
//     return "";
//   }, [selectedDate]);
// 
//   return (
//     <View>
//       <Text style={styles.sectionTitle}>Select Date: {displayMonth}</Text>
//       <FlatList
//         data={dateOptions}
//         keyExtractor={(item) => item.dateKey}
//         renderItem={({ item }) => (
//           <DaySlot day={item} isSelected={item.dateKey === selectedDate} onSelect={() => onSelectDate(item.dateKey)} />
//         )}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.horizontalListContainer}
//       />
//     </View>
//   );
// };
// 
// const styles = StyleSheet.create({
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#1f2937",
//     paddingHorizontal: 16,
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   horizontalListContainer: {
//     paddingHorizontal: 16,
//     paddingBottom: 10,
//   },
//   daySlot: {
//     width: 60,
//     height: 70,
//     borderRadius: 8,
//     marginRight: 12,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//   },
//   daySlotDefault: {
//     backgroundColor: "#f9fafb",
//     borderColor: "#e5e7eb",
//   },
//   daySlotSelected: {
//     backgroundColor: "#3b82f6",
//     borderColor: "#3b82f6",
//   },
//   dayText: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#4b5563",
//   },
//   dayTextSelected: {
//     color: "#fff",
//   },
//   dateText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginTop: 2,
//     color: "#1f2937",
//   },
//   dateTextSelected: {
//     color: "#fff",
//   },
// });

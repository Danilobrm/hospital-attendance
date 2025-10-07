import React, { useState } from "react";
import { Text, View, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { DoctorListScreen } from "./components/DoctorsList";
import { useNavigation } from "@react-navigation/native";
import { Menu } from "../../components/Menu";
import { TopBar } from "../../components/TopBar";

export const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <TopBar />

      <View style={styles.mainContent}>
        <Text style={styles.scheduleText}>Schedule an Appointment</Text>
        <DoctorListScreen />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  // welcomeText: {
  //   fontSize: 16,
  //   color: "#374151",
  //   fontWeight: "500",
  //   padding: 16,
  //   textAlign: "center",
  // },
  scheduleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    padding: 16,
  },
});

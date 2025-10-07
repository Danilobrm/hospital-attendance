import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { TouchableOpacity, View, Text, Dimensions, StyleSheet } from "react-native";
import { useAuth } from "../contexts/AuthContext";

interface MenuItemProps {
  title: string;
  onPress: () => void;
}


const MenuItem: React.FC<MenuItemProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuText}>{title}</Text>
    </TouchableOpacity>
  );
};

export const Menu: React.FC<{ toggleMenu: () => void }> = ({ toggleMenu }) => {
  const { patient, logout } = useAuth();
  const navigation = useNavigation();

  const handleClick = (screen: never) => {
    toggleMenu();
    navigation.navigate(screen);
  };

  const handleLogout = () => {
    toggleMenu();
    logout();
  };

  return (
    <TouchableOpacity style={styles.menuOverlay} onPress={toggleMenu} activeOpacity={1}>
      <View style={styles.menuDrawer}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuHeaderText}>{patient?.name}</Text>
        </View>

        <MenuItem title="Home" onPress={() => handleClick("Home" as never)} />
        <MenuItem title="My Appointments" onPress={() => handleClick("Appointments" as never)} />

        <View style={styles.menuSeparator} />

        <MenuItem title="Log Out" onPress={handleLogout} />
      </View>
    </TouchableOpacity>
  );
};

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark semi-transparent background
    zIndex: 10,
  },
  menuDrawer: {
    width: windowWidth * 0.75, // Menu takes 75% of screen width
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  menuHeader: {
    padding: 16,
    backgroundColor: "#dbeafe", // Light blue background
    borderBottomWidth: 1,
    borderBottomColor: "#3b82f6",
    marginBottom: 10,
  },
  menuHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e3a8a", // Darker blue
  },
  menuSubText: {
    fontSize: 14,
    color: "#60a5fa", // Medium blue
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  menuSeparator: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginVertical: 10,
  },
});

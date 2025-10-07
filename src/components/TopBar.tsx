import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Menu } from "./Menu";

export const TopBar: React.FC = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerButton}>
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>

      {isMenuVisible && <Menu toggleMenu={toggleMenu} />}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#3b82f6",
    paddingTop: 45,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  hamburgerButton: {
    padding: 8,
  },
  hamburgerIcon: {
    fontSize: 24,
    color: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  headerPlaceholder: {
    width: 40,
  },
});

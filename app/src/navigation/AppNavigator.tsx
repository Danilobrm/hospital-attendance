import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { HomeScreen } from "../screens/Home/Home";
import { DoctorDetails } from "../screens/Doctors/DoctorDetailsScreen";
import { AppointmentsScreen } from "../screens/Appointments/AppointmentsScreen";

const AppStack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        statusBarHidden: true,
      }}
    >
      <AppStack.Screen name="Home" component={HomeScreen} />
      <AppStack.Screen
        name="DoctorDetails"
        component={DoctorDetails}
        options={{
          presentation: "modal",
        }}
      />
      <AppStack.Screen name="Appointments" component={AppointmentsScreen} />
    </AppStack.Navigator>
  );
};

export default AppNavigator;

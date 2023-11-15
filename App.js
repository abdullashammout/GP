import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/home";
import PaitentHome from "./screens/patient/home";
import LoginForm from "./screens/patient/login";
import SignUPForm from "./screens/patient/signUp";
import SearchPh from "./screens/pharmacy/searchPharmacy";
import SearchLabor from "./screens/laboratory/searchLaboratory";
import PatientPage from "./screens/patient/patientPage";
import SearchHos from "./screens/hospital/main";
import ResetPasswordScreen from "./screens/patient/ResetPassword";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="home"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="patientHome"
          component={PaitentHome}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginForm}
          options={{
            headerTitleAlign: "center",
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUPForm}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="pharmacy"
          component={SearchPh}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            title: "phar",
          }}
        />
        <Stack.Screen
          name="laboratory"
          component={SearchLabor}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            title: "lab",
          }}
        />
        <Stack.Screen
          name="patientPage"
          component={PatientPage}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="hospital" component={SearchHos} />
        <Stack.Screen
          name="resetPasswordScreen"
          component={ResetPasswordScreen}
          options={{
            headerTitleAlign: "center",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

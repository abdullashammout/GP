import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Home from "./screens/home";
import PaitentHome from "./screens/patient/home";
import LoginForm from "./screens/patient/login";
import SignUPForm from "./screens/patient/signUp";
import Search from "./screens/pharmacy/search";

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
          component={Search}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

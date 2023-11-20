import React, { useState, useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth } from "./firebase";
import { Alert, BackHandler } from "react-native";

import Home from "./screens/home";
import PaitentHome from "./screens/patient/home";
import LoginForm from "./screens/patient/login";
import SignUPForm from "./screens/patient/signUp";
import SearchPh from "./screens/pharmacy/searchPharmacy";
import SearchHospital from "./screens/hospital/searchHospital";
import SearchLabor from "./screens/laboratory/searchLaboratory";
import PatientPage from "./screens/patient/patientPage";
import MainScreen from "./screens/hospital/main";
import ResetPasswordScreen from "./screens/patient/ResetPassword";
import Prescription from "./screens/hospital/prescr/prescription";
import Diagnosis from "./screens/hospital/diagnosis";
import Treatments from "./screens/hospital/treatments";
import Allergies from "./screens/hospital/allergies";
import Lab from "./screens/hospital/labResults";
import BloodDonation from "./screens/hospital/bloodDonation";
import HospitalStay from "./screens/hospital/stay/hospitalStay";
import Vaccine from "./screens/hospital/vaccine";
import PresList from "./screens/hospital/prescr/presList";
import StayList from "./screens/hospital/stay/stayList";

const Stack = createNativeStackNavigator();

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const navigationRef = useRef();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUserLoggedIn(!!user);

      if (!user) {
        navigationRef.current.navigate("home");
      }
    });

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        const currentRoute = navigationRef.current.getCurrentRoute();

        // Check if the user is on one of the special screens
        if (
          currentRoute.name === "hospital" ||
          currentRoute.name === "pharmacy" ||
          currentRoute.name === "laboratory" ||
          currentRoute.name === "patientPage"
        ) {
          Alert.alert(
            "Logout Confirmation",
            "Are you sure you want to logout?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Logout",
                onPress: async () => {
                  try {
                    await auth.signOut(); // Sign out the user
                  } catch (error) {
                    console.error("Error during logout:", error.message);
                    // Show an error alert if there is an issue during logout
                    Alert.alert(
                      "Logout Error",
                      "An error occurred during logout. Please try again."
                    );
                  }
                },
              },
            ]
          ); // logout
          return true; // Tell the app that we've handled the back press
        }

        return false; // Let the default back press behavior happen
      }
    );

    return () => {
      unsubscribe();
      backHandler.remove(); // Remove the event listener when the component unmounts
    };
  }, [userLoggedIn]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        {userLoggedIn ? (
          <>
            <Stack.Screen
              name="hospital"
              component={SearchHospital}
              options={{
                headerShown: false,
                headerTitleAlign: "center",
              }}
            />
            <Stack.Screen
              name="pharmacy"
              component={SearchPh}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="laboratory"
              component={SearchLabor}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="patientPage"
              component={PatientPage}
              options={{
                headerShown: false,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="home"
              component={Home}
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
              name="patientHome"
              component={PaitentHome}
              options={{
                headerShown: false,
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
              name="resetPasswordScreen"
              component={ResetPasswordScreen}
              options={{
                headerTitleAlign: "center",
                title: "Password Reset",
              }}
            />
          </>
        )}

        <Stack.Screen
          name="hospitalMain"
          component={MainScreen}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            title: "Patient Information",
          }}
        />

        <Stack.Screen
          name="Prescription"
          component={Prescription}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="diagnosis"
          component={Diagnosis}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="treatments"
          component={Treatments}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="allergies"
          component={Allergies}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="lab"
          component={Lab}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="BloodDonation"
          component={BloodDonation}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="hospitalStay"
          component={HospitalStay}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="vaccine"
          component={Vaccine}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="presList"
          component={PresList}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="StayList"
          component={StayList}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

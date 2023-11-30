import React, { useState, useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth } from "./firebase";
import { Alert, BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Home from "./screens/home";
import LoadingScreen from "./screens/Loading";
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
import SettingsScreen from "./screens/drawerScreens/settings";
import AccountInfoScreen from "./screens/drawerScreens/accountInfo";
import AboutUsScreen from "./screens/drawerScreens/aboutUs";
import PrivacyScreen from "./screens/drawerScreens/privacy";
import ChangeEmailScreen from "./screens/drawerScreens/settingsScreens/changeEmail";
import ChangePassScreen from "./screens/drawerScreens/settingsScreens/changePassword";

const Stack = createNativeStackNavigator();

const getRolePage = (role) => {
  switch (role) {
    case "patients":
      return "patientPage";
    case "medical_units/hospital":
      return "hospital";
    case "medical_units/pharmacy":
      return "pharmacy";
    case "medical_units/laboratory":
      return "laboratory";
    default:
      return "home"; // Default to the home page if the role is unknown
  }
};
const getRoleComponent = (role) => {
  switch (role) {
    case "patients":
      return PatientPage;
    case "medical_units/hospital":
      return SearchHospital;
    case "medical_units/pharmacy":
      return SearchPh;
    case "medical_units/laboratory":
      return SearchLabor;
    default:
      return Home; // Default to the home component if the role is unknown
  }
};

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const navigationRef = useRef(null);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const user = auth.currentUser;
      setUserLoggedIn(!!user);

      if (user) {
        const storedUserRole = await AsyncStorage.getItem("userRole");
        console.log("Stored User Role:", storedUserRole);

        if (storedUserRole) {
          const rolePage = getRolePage(storedUserRole);
          console.log("Navigating to:", rolePage);

          navigationRef.current?.reset({
            index: 0,
            routes: [{ name: rolePage, params: { userId: user.uid } }],
          });
        } else {
          console.log("No stored role found, navigating to home");
        }
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (userLoggedIn !== !!user) {
        checkUserLoggedIn();
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
                    await AsyncStorage.removeItem("userRole");
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
      backHandler.remove(); // Remove the event listener when the component unmounts
      unsubscribe();
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
              name="patientPage"
              component={PatientPage}
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
              name={getRolePage("userRole")}
              component={getRoleComponent("userRole")}
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
                statusBarStyle: "dark",
              }}
            />
          </>
        )}

        <Stack.Screen
          name="Login"
          component={LoginForm}
          options={{
            headerTitleAlign: "center",
            headerShadowVisible: false,
            statusBarStyle: "dark",
          }}
        />
        <Stack.Screen
          name="patientHome"
          component={PaitentHome}
          options={{
            headerShown: false,
            statusBarStyle: "dark",
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUPForm}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
          }}
        />
        <Stack.Screen
          name="resetPasswordScreen"
          component={ResetPasswordScreen}
          options={{
            headerTitleAlign: "center",
            title: "Password Reset",
            statusBarStyle: "dark",
          }}
        />
        <Stack.Screen
          name="hospitalMain"
          component={MainScreen}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            title: "Patient Information",
            statusBarStyle: "dark",
          }}
        />

        <Stack.Screen
          name="Prescription"
          component={Prescription}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
          }}
        />
        <Stack.Screen
          name="diagnosis"
          component={Diagnosis}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
          }}
        />
        <Stack.Screen
          name="treatments"
          component={Treatments}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
          }}
        />
        <Stack.Screen
          name="allergies"
          component={Allergies}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
          }}
        />
        <Stack.Screen
          name="lab"
          component={Lab}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
          }}
        />
        <Stack.Screen
          name="BloodDonation"
          component={BloodDonation}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
          }}
        />
        <Stack.Screen
          name="hospitalStay"
          component={HospitalStay}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
          }}
        />
        <Stack.Screen
          name="vaccine"
          component={Vaccine}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
          }}
        />
        <Stack.Screen
          name="presList"
          component={PresList}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
          }}
        />
        <Stack.Screen
          name="StayList"
          component={StayList}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerTitleAlign: "center",
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "#34495e",
            },
          }}
        />
        <Stack.Screen name="AccountInfo" component={AccountInfoScreen} />
        <Stack.Screen name="AboutUs" component={AboutUsScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassScreen}
          options={{
            headerTitleAlign: "center",
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "#34495e",
            },
          }}
        />
        <Stack.Screen name="ChangeEmail" component={ChangeEmailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

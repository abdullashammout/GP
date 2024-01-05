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
import PatientPage from "./screens/patient/patientPage";
import MainScreen from "./screens/hospital/main";
import ResetPasswordScreen from "./screens/patient/ResetPassword";
import Prescription from "./screens/hospital/prescr/prescription";
import Treatments from "./screens/hospital/treat/treatments";
import TreatmentDetails from "./screens/hospital/treat/treatDetails";
import Allergies from "./screens/hospital/allergies";
import BloodDonation from "./screens/hospital/bloodDonation";
import HospitalStay from "./screens/hospital/stay/hospitalStay";
import Vaccine from "./screens/hospital/vaccine";
import PresList from "./screens/hospital/prescr/presList";
import StayList from "./screens/hospital/stay/stayList";
import AccountInfoScreen from "./screens/drawerScreens/accountInfo";
import AboutUsScreen from "./screens/drawerScreens/aboutUs";
import PrivacyScreen from "./screens/drawerScreens/privacy";
import ChangeEmailScreen from "./screens/drawerScreens/settingsScreens/changeEmail";
import ChangePassScreen from "./screens/drawerScreens/settingsScreens/changePassword";
import PatientPrescription from "./screens/patient/prescriptions/patientPrescription";
import Vaccines from "./screens/patient/vaccines";
import BloodDonations from "./screens/patient/bloodDonations";
import PatientAllergies from "./screens/patient/patientAllergies";
import PrescriptionDetails from "./screens/patient/prescriptions/prescriptionDetails";
import PatientTreatments from "./screens/patient/Treatments/pTreatments";
import PatientTreatDetails from "./screens/patient/Treatments/treatmentDetails";
import DiagnosisList from "./screens/hospital/diagnosis";
import PatientDiagnosis from "./screens/patient/patientDiagnosis";
import PatientStay from "./screens/patient/HospitalStay/hospitalStay";
import ChronicIllness from "./screens/hospital/chronicIllness";
import PatientChronic from "./screens/patient/patientChronic";
import PharPrescription from "./screens/pharmacy/prescriptions";
import PatientStayDetails from "./screens/patient/HospitalStay/hospitalStayDetails";
import Medications from "./screens/pharmacy/medications";

const Stack = createNativeStackNavigator();

const getRolePage = (role) => {
  switch (role) {
    case "patients":
      return "patientPage";
    case "medical_units/hospital":
      return "hospital";
    case "medical_units/pharmacy":
      return "pharmacy";
    default:
      return "load"; // Default to the home page if the role is unknown
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
    default:
      return LoadingScreen; // Default to the home component if the role is unknown
  }
};

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigationRef = useRef(null);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const user = auth.currentUser;
      setUserLoggedIn(!!user);

      if (user) {
        try {
          const storedUserRole = await AsyncStorage.getItem("userRole");

          if (storedUserRole) {
            const rolePage = getRolePage(storedUserRole);
            const storedUserID = await AsyncStorage.getItem("userID");

            navigationRef.current?.reset({
              index: 0,
              routes: [
                {
                  name: rolePage,
                  params: { userUid: user.uid, userId: storedUserID },
                },
              ],
            });
          } else {
            console.log("No stored role found, navigating to home");
          }
        } catch (error) {
          console.error("Error during fetching user role:", error.message);
        } finally {
          setLoading(false); // Set loading to false after fetching user role
        }
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false);
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

  useEffect(() => {
    const backHandlerr = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        const currentRoute = navigationRef.current.getCurrentRoute();

        // Check if the user is on one of the special screens
        if (currentRoute.name === "hospitalMain") {
          Alert.alert(
            "Exit Confirmation",
            "Are you sure you want to exit patient record?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Exit",
                onPress: async () => {
                  navigationRef.current.goBack();
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
      backHandlerr.remove();
    };
  }, []);

  useEffect(() => {
    const backHandlerr = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        const currentRoute = navigationRef.current.getCurrentRoute();

        // Check if the user is on one of the special screens
        if (currentRoute.name === "pharPrescriptions") {
          Alert.alert(
            "Exit Confirmation",
            "Are you sure you want to exit patient Prescription History?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Exit",
                onPress: async () => {
                  navigationRef.current.goBack();
                },
              },
            ]
          );
          return true; // Tell the app that we've handled the back press
        }

        return false; // Let the default back press behavior happen
      }
    );
    return () => {
      backHandlerr.remove();
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        {userLoggedIn ? (
          <>
            <Stack.Screen
              name={getRolePage("userRole")}
              component={getRoleComponent("userRole")}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="hospital"
              component={SearchHospital}
              options={{
                headerShown: false,
                headerTitleAlign: "center",
                statusBarColor: "white",
                statusBarStyle: "dark",
              }}
            />
            <Stack.Screen
              name="pharmacy"
              component={SearchPh}
              options={{
                headerShown: false,
                statusBarColor: "white",
                statusBarStyle: "dark",
              }}
            />
            <Stack.Screen
              name="patientPage"
              component={PatientPage}
              options={{
                headerShown: false,
                statusBarStyle: "light",
                statusBarColor: "#3498db",
              }}
            />
          </>
        ) : loading ? (
          <Stack.Screen
            name="Load"
            component={LoadingScreen}
            options={{
              headerShown: false,
              statusBarStyle: "dark",
            }}
          />
        ) : (
          <Stack.Screen
            name="home"
            component={Home}
            options={{
              headerShown: false,
              statusBarStyle: "dark",
            }}
          />
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
            title: "Sign Up",
          }}
        />
        <Stack.Screen
          name="resetPasswordScreen"
          component={ResetPasswordScreen}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            title: "Password Reset",
            statusBarStyle: "dark",
          }}
        />
        <Stack.Screen
          name="hospitalMain"
          component={MainScreen}
          options={{
            headerShown: false,
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
            title: "Prescriptions",
          }}
        />
        <Stack.Screen
          name="diagnosis"
          component={DiagnosisList}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Patient Diagnosis",
          }}
        />
        <Stack.Screen
          name="treatments"
          component={Treatments}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Treatments",
          }}
        />
        <Stack.Screen
          name="TreatmentDetails"
          component={TreatmentDetails}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Treatment Details",
          }}
        />
        <Stack.Screen
          name="allergies"
          component={Allergies}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Allergies",
          }}
        />
        <Stack.Screen
          name="chronic"
          component={ChronicIllness}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Chronic Diseases",
          }}
        />
        <Stack.Screen
          name="BloodDonation"
          component={BloodDonation}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Blood Donation Tracker",
          }}
        />
        <Stack.Screen
          name="hospitalStay"
          component={HospitalStay}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Hospital Entries",
          }}
        />
        <Stack.Screen
          name="vaccine"
          component={Vaccine}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Vaccine Tracker",
          }}
        />
        <Stack.Screen
          name="presList"
          component={PresList}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Prescription Details",
          }}
        />
        <Stack.Screen
          name="StayList"
          component={StayList}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Hospital Entry Details",
          }}
        />
        <Stack.Screen
          name="AccountInfo"
          component={AccountInfoScreen}
          options={{
            headerTitleAlign: "center",
            headerTintColor: "white",
            statusBarColor: "#34495e",
            statusBarStyle: "light",
            headerStyle: {
              backgroundColor: "#34495e",
            },
            title: "My Information",
          }}
        />
        <Stack.Screen
          name="AboutUs"
          component={AboutUsScreen}
          options={{
            headerTitleAlign: "center",
            headerTintColor: "white",
            statusBarColor: "#34495e",
            statusBarStyle: "light",
            headerStyle: {
              backgroundColor: "#34495e",
            },
            title: "About Us",
          }}
        />
        <Stack.Screen
          name="Privacy"
          component={PrivacyScreen}
          options={{
            headerTitleAlign: "center",
            headerTintColor: "white",
            statusBarColor: "#34495e",
            statusBarStyle: "light",
            headerStyle: {
              backgroundColor: "#34495e",
            },
            title: "Privacy Policy",
          }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassScreen}
          options={{
            headerTitleAlign: "center",
            headerTintColor: "white",
            statusBarColor: "#34495e",
            statusBarStyle: "light",
            headerStyle: {
              backgroundColor: "#34495e",
            },
            title: "Change Password",
          }}
        />
        <Stack.Screen
          name="ChangeEmail"
          component={ChangeEmailScreen}
          options={{
            headerTitleAlign: "center",
            headerTintColor: "white",
            statusBarColor: "#34495e",
            statusBarStyle: "light",
            headerStyle: {
              backgroundColor: "#34495e",
            },
            title: "Change Email",
          }}
        />
        <Stack.Screen
          name="patientPres"
          component={PatientPrescription}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Prescription History",
          }}
        />
        <Stack.Screen
          name="patientVaccines"
          component={Vaccines}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Vaccine History",
          }}
        />
        <Stack.Screen
          name="patientBloodDonations"
          component={BloodDonations}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Blood Donation",
          }}
        />
        <Stack.Screen
          name="patientAllergies"
          component={PatientAllergies}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Allergy History",
          }}
        />
        <Stack.Screen
          name="patientMedications"
          component={PrescriptionDetails}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Prescription Details",
          }}
        />
        <Stack.Screen
          name="pTreat"
          component={PatientTreatments}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Treatments History",
          }}
        />
        <Stack.Screen
          name="pTreatDetails"
          component={PatientTreatDetails}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Treatment Details",
          }}
        />
        <Stack.Screen
          name="pDiagnosis"
          component={PatientDiagnosis}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Diagnosis History",
          }}
        />
        <Stack.Screen
          name="pStay"
          component={PatientStay}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Hospital Entries",
          }}
        />
        <Stack.Screen
          name="pChronic"
          component={PatientChronic}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Chronic Diseases History",
          }}
        />
        <Stack.Screen
          name="PStayDetails"
          component={PatientStayDetails}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Entry Details",
          }}
        />
        <Stack.Screen
          name="pharPrescriptions"
          component={PharPrescription}
          options={{
            headerShown: false,
            statusBarStyle: "dark",
          }}
        />
        <Stack.Screen
          name="PharMedications"
          component={Medications}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            statusBarStyle: "dark",
            title: "Prescription Details",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

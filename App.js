import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
          name="hospital"
          component={SearchHospital}
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
        <Stack.Screen
          name="resetPasswordScreen"
          component={ResetPasswordScreen}
          options={{
            headerTitleAlign: "center",
          }}
        />

        <Stack.Screen
          name="hospitalMain"
          component={MainScreen}
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            title: "hospital",
          }}
        />
        <Stack.Screen name="Prescription" component={Prescription} />
        <Stack.Screen name="diagnosis" component={Diagnosis} />
        <Stack.Screen name="treatments" component={Treatments} />
        <Stack.Screen name="allergies" component={Allergies} />
        <Stack.Screen name="lab" component={Lab} />
        <Stack.Screen name="BloodDonation" component={BloodDonation} />
        <Stack.Screen name="hospitalStay" component={HospitalStay} />
        <Stack.Screen name="vaccine" component={Vaccine} />
        <Stack.Screen name="presList" component={PresList} />
        <Stack.Screen name="StayList" component={StayList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

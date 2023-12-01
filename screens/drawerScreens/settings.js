import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { auth, db } from "../../firebase";
import { ref, get, update } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen({ navigation, route }) {
  const { userId } = route.params || {};
  const [load, setLoad] = useState(false);

  const logout = async () => {
    Alert.alert("Logout Confirmation", "Are you sure you want to logout?", [
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
            await AsyncStorage.removeItem("PatientName");
            await AsyncStorage.removeItem("pass");
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
    ]);
  };
  const deleteAccount = async () => {
    Alert.alert(
      "Delete Account Confirmation",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            Alert.alert(
              "WARNING!",
              "Make sure by deleting the account all information about your medical record will be deleted",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Ok",
                  onPress: async () => {
                    setLoad(true);
                    try {
                      // Get the user data from the Realtime Database
                      const userData = ref(db, `users/patients/${userId}`);
                      const userSnapshot = await get(userData);

                      if (userSnapshot.exists()) {
                        await auth.currentUser.delete();
                        update(userData, {
                          email: null,
                        });

                        await AsyncStorage.removeItem("userRole");
                        await AsyncStorage.removeItem("PatientName");
                        await AsyncStorage.removeItem("pass");
                        setLoad(false);
                        navigation.navigate("home");
                      }
                    } catch (error) {
                      console.error(
                        "Error during account deletion:",
                        error.message
                      );
                      Alert.alert(
                        "Delete Account Error",
                        "An error occurred during account deletion. Please try again."
                      );
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };
  if (load) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ecf0f1",
      }}
    >
      <TouchableOpacity
        style={{
          padding: 17,
          height: 60,
          width: 350,
          borderRadius: 10,
          borderColor: "#f0f0f0",
          borderWidth: 2,
          backgroundColor: "#34495e",
        }}
        onPress={() => {
          navigation.navigate("ChangePassword");
        }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>
          Change Password
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginTop: 10,
          padding: 17,
          height: 60,
          width: 350,
          borderRadius: 10,
          borderColor: "#f0f0f0",
          backgroundColor: "#34495e",
          borderWidth: 2,
        }}
        onPress={() => {
          navigation.navigate("ChangeEmail", { userId });
        }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>
          Change Email
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginTop: 10,
          padding: 17,
          height: 60,
          width: 350,
          borderRadius: 10,
          borderColor: "#f0f0f0",
          backgroundColor: "#34495e",
          borderWidth: 2,
        }}
        onPress={logout}
      >
        <Text style={{ textAlign: "center", color: "white" }}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginTop: 10,
          padding: 17,
          height: 60,
          width: 350,
          borderRadius: 10,
          borderColor: "#f0f0f0",
          backgroundColor: "red",
          borderWidth: 2,
        }}
        onPress={deleteAccount}
      >
        <Text style={{ textAlign: "center", color: "white" }}>
          Delete Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

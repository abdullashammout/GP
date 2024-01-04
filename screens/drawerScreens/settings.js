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
import styles from "../../styles/drawerStyles/settingsStyle";

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

  if (load) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("ChangePassword");
        }}
      >
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("ChangeEmail", { userId });
        }}
      >
        <Text style={styles.buttonText}>Change Email</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

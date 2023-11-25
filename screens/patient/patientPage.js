import { View, Text, TouchableOpacity, Alert } from "react-native";
import { auth } from "../../firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PatientPage() {
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
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>hiii iam patient page</Text>
      <TouchableOpacity
        style={{ position: "absolute", top: 60, right: 40 }}
        onPress={logout}
      >
        <MaterialCommunityIcons name="logout" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

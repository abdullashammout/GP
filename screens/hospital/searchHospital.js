import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { ref, get } from "firebase/database";
import { db, auth } from "../../firebase";
import React, { useEffect, useState } from "react";
import styles from "../../styles/hospitalStyles/searchHospitalStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SearchHospital({ navigation, route }) {
  const { userId } = route.params || {};
  const [hospitalName, setHospitalname] = useState("");
  const [id, setId] = useState("");
  const [idError, setIdError] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const fetchHospitalName = async () => {
      try {
        const userRef = ref(db, `users/medical_units/hospital/${userId}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const { name } = snapshot.val();
          await AsyncStorage.setItem("HospitalName", name);
        } else {
          console.log("Hospital not found");
        }
      } catch (error) {
        console.error("Error fetching hospital data:", error);
      } finally {
      }
    };

    fetchHospitalName();
  }, [userId]);
  const getHospitalName = async () => {
    const hosName = await AsyncStorage.getItem("HospitalName");
    setHospitalname(hosName);
  };
  getHospitalName();

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
            await auth.signOut();
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

  const handleSearch = async () => {
    setLoading(true);
    if (id === "") {
      setIdError("This Field Is Required");
      return;
    } else {
      setIdError(null);
    }
    if (id.length < 10) {
      setId("");
      setIdError("ID must be 10 digits");
      return;
    } else {
      setIdError(null);
    }

    // Check if the ID is present in the database
    const idExists = await checkIdInDatabase();

    if (!idExists) {
      setId("");
      setIdError(
        "ID not found",
        "The entered patient ID does not exist in the database."
      );
      return;
    }

    // Check if the user has an account
    const userHasAccount = await checkUserAccount();

    if (!userHasAccount) {
      setId("");
      setIdError("The patient with this ID does not have an account.");
      return;
    }
    setLoading(false);
    navigation.navigate("hospitalMain", { patientId: id });
    setId("");
  };
  // Function to check if the ID exists in the database
  const checkIdInDatabase = async () => {
    try {
      const idQuery = ref(db, `users/patients/` + id);
      const idSnapshot = await get(idQuery);
      return idSnapshot.exists();
    } catch (error) {
      alert("Error checking ID in database:", error);
      return false;
    }
  };

  // Function to check if the user has an account
  const checkUserAccount = async () => {
    try {
      const idQuery = ref(db, `users/patients/${id}/email`);
      const idSnapshot = await get(idQuery);
      const emailExist = idSnapshot.exists();

      return emailExist;
    } catch (error) {
      return false;
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <Text style={styles.hospitalName}>{hospitalName}</Text>
        <Text style={{ fontWeight: "normal" }}>
          Enter patient ID to Update his record
        </Text>
        <TextInput
          style={styles.input}
          placeholder={idError ? idError : "Enter Patient ID"}
          placeholderTextColor={idError ? "red" : "gray"}
          value={id}
          onChangeText={(text) => setId(text)}
          maxLength={10}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>
            {loading ? "Searching..." : "Search"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logout} onPress={logout}>
          <Text>Logout</Text>
          <MaterialCommunityIcons name="logout" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

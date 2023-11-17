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
import { db } from "../../firebase";
import react, { useState } from "react";
import styles from "../../styles/hospitalStyles/searchHospitalStyle";
import { useNavigation } from "@react-navigation/native";

export default function SearchHospital() {
  const [id, setId] = useState("");
  const [idError, setIdError] = useState(null);
  const navigation = useNavigation();

  const handleSearch = async () => {
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
        <Text style={{ fontWeight: "bold" }}>
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
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

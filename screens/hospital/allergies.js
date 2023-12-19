import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { set, ref, push, get } from "firebase/database";
import { db } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PatientAllergiesPage = ({ navigation, route }) => {
  const { patientId } = route.params;
  const [allergies, setAllergies] = useState([]);
  const [allergyName, setAllergyName] = useState("");
  const [allergyNameError, setAlleryNameError] = useState(null);
  const [medicalUnitName, setMedicalUnitName] = useState("");
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;

  const loadData = async () => {
    try {
      const AllergyDataRef = ref(db, `users/patients/${patientId}/Allergy`);
      const snapshot = await get(AllergyDataRef);
      const loadedData = [];

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const itemData = childSnapshot.val();
          itemData.id = childSnapshot.key;
          loadedData.push(itemData);
        });
        setAllergies(loadedData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, [patientId, allergies]);

  const getMedicalUnitName = async () => {
    const Name = await AsyncStorage.getItem("HospitalName");
    setMedicalUnitName(Name);
  };
  getMedicalUnitName();

  const addAllergy = async () => {
    if (allergyName === "") {
      setAllergyName("");
      setAlleryNameError("Please Enter Allergy Name");
      return;
    }

    try {
      const newAllergy = { allergyName, formattedDate, medicalUnitName };
      const AllergyDataRef = ref(db, `users/patients/${patientId}/Allergy`);

      const newAllergyRef = push(AllergyDataRef, newAllergy);

      const newItemId = newAllergyRef.key;
      newAllergy.id = newItemId;

      await set(newAllergyRef, newAllergy);
      setAllergies((prevData) => [...prevData, newAllergy]);

      setAllergyName("");
      setAlleryNameError("");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const deleteAllergy = async (id) => {
    try {
      const newAllergies = allergies.filter((item) => item.id !== id);

      const AllergyDataRef = ref(
        db,
        `users/patients/${patientId}/Allergy/${id}`
      );
      await set(AllergyDataRef, null);
      setAllergies(newAllergies);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={
            allergyNameError ? allergyNameError : "Enter new allergy"
          }
          placeholderTextColor={allergyNameError ? "red" : "gray"}
          value={allergyName.trim()}
          onChangeText={(text) => setAllergyName(text)}
        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={addAllergy}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Allergy History</Text>
      {allergies.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No Allergies recorded for this patient.</Text>
        </View>
      ) : (
        <FlatList
          data={allergies}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.allergyItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Name:</Text>
                <Text>{item.allergyName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Hospital:</Text>
                <Text>{item.medicalUnitName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}> Date:</Text>
                <Text>{item.formattedDate}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteAllergy(item.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  allergyItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#ADD8E6",
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    marginRight: 5,
  },

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    paddingLeft: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  deleteButton: {
    position: "absolute",
    alignSelf: "flex-end",
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 5,
    marginTop: 22,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PatientAllergiesPage;

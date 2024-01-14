import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import styles from "../../styles/hospitalStyles/allergyStyles";
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
    } catch (error) {}
  };

  useEffect(() => {
    loadData();
  }, [patientId]);

  const getMedicalUnitName = async () => {
    const Name = await AsyncStorage.getItem("HospitalName");
    setMedicalUnitName(Name);
  };
  getMedicalUnitName();

  const addAllergy = async () => {
    if (allergyName === "") {
      setAllergyName("");
      setAlleryNameError("Required");
      return;
    }
    if (allergyName.length < 3) {
      setAllergyName("");
      setAlleryNameError("Minimum length 3 letters.");
      return;
    }
    if (!/^[a-zA-Z\s]*$/.test(allergyName)) {
      setAllergyName("");
      setAlleryNameError("only letters allowed.");
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
    } catch (error) {}
  };

  const deleteAllergy = async (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this Allergy?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const newAllergies = allergies.filter((item) => item.id !== id);

              const AllergyDataRef = ref(
                db,
                `users/patients/${patientId}/Allergy/${id}`
              );
              await set(AllergyDataRef, null);
              setAllergies(newAllergies);
            } catch (error) {}
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={{ bottom: 5, fontWeight: "700" }}>Allergy Name: </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={allergyNameError ? allergyNameError : "Allergy Name"}
          placeholderTextColor={allergyNameError ? "red" : "gray"}
          value={allergyName}
          onChangeText={(text) => setAllergyName(text)}
          maxLength={20}
        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={addAllergy}>
        <Text style={{ ...styles.buttonText, fontSize: 16 }}>Add Allergy</Text>
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
                <Text style={styles.label}>Allergy name:</Text>
                <Text style={{ fontWeight: "bold" }}>
                  <Text style={{ fontWeight: "normal" }}>
                    {item.allergyName}
                  </Text>
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Hospital name:</Text>
                <Text>{item.medicalUnitName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Date:</Text>
                <Text>{item.formattedDate}</Text>
              </View>
              {item.medicalUnitName === medicalUnitName && ( // Check if created by the current medical unit
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteAllergy(item.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

export default PatientAllergiesPage;

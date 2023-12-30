import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import styles from "../../styles/hospitalStyles/vaccineStyles";
import { set, ref, push, get } from "firebase/database";
import { db } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Vaccine = ({ route }) => {
  const { patientId } = route.params;
  const [vaccines, setVaccines] = useState([]);
  const [vaccineName, setVaccineName] = useState("");
  const [vaccineNameError, setVaccineNameError] = useState(null);
  const [medicalUnitName, setMedicalUnitName] = useState("");
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;

  const loadData = async () => {
    try {
      const presDataRef = ref(db, `users/patients/${patientId}/Vaccine`);
      const snapshot = await get(presDataRef);
      const loadedData = [];

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const itemData = childSnapshot.val();
          itemData.id = childSnapshot.key;
          loadedData.push(itemData);
        });
        setVaccines(loadedData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };
  useEffect(() => {
    loadData();
  }, [patientId]);
  const getMedicalUnitName = async () => {
    const Name = await AsyncStorage.getItem("HospitalName");
    setMedicalUnitName(Name);
  };
  getMedicalUnitName();

  const addVaccine = async () => {
    if (vaccineName === "") {
      setVaccineName("");
      setVaccineNameError("Please enter vaccine name");
      return;
    }
    try {
      if (vaccineName) {
        const newVaccine = { vaccineName, formattedDate, medicalUnitName };

        const presDataRef = ref(db, `users/patients/${patientId}/Vaccine`);

        const newVaccineRef = push(presDataRef, newVaccine);

        const newItemId = newVaccineRef.key;
        newVaccine.id = newItemId;

        set(newVaccineRef, newVaccine);
        setVaccines((prevData) => [...prevData, newVaccine]);

        setVaccineName("");
        setVaccineNameError(null);
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const deleteVaccine = async (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this Diagnosis?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const newVaccines = vaccines.filter((item) => item.id !== id);

              const presDataRef = ref(
                db,
                `users/patients/${patientId}/Vaccine/${id}`
              );
              await set(presDataRef, null);

              setVaccines(newVaccines);
            } catch (error) {
              console.error("Error deleting item:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder={vaccineNameError ? vaccineNameError : "Vaccine Name"}
          placeholderTextColor={vaccineNameError ? "red" : "gray"}
          value={vaccineName}
          onChangeText={(text) => setVaccineName(text)}
        />

        <TouchableOpacity style={styles.addButton} onPress={addVaccine}>
          <Text style={{ ...styles.buttonText, fontSize: 16 }}>
            Add Vaccine
          </Text>
        </TouchableOpacity>

        <Text style={styles.historyHeader}>Vaccine History</Text>
        {vaccines.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>No Vaccines recorded for this patient.</Text>
          </View>
        ) : (
          <FlatList
            data={vaccines}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.vaccineItem}>
                <Text style={{ fontWeight: "bold" }}>
                  Vaccine Name:{" "}
                  <Text style={{ fontWeight: "normal" }}>
                    {item.vaccineName}
                  </Text>
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  hospital:{" "}
                  <Text style={{ fontWeight: "normal" }}>
                    {item.medicalUnitName}
                  </Text>
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  Date:{" "}
                  <Text style={{ fontWeight: "normal" }}>
                    {item.formattedDate}
                  </Text>
                </Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteVaccine(item.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Vaccine;

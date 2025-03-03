import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import styles from "../../../styles/hospitalStyles/detailsPresStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set, ref, get, push } from "firebase/database";
import { db } from "../../../firebase";

const PresList = ({ route }) => {
  const { itemId, patientId, currentMedicalUnit, CreatedBy, Diagnosis } =
    route.params;
  const [medicalUnitName, setMedicalUnitName] = useState("");
  const [medications, setMedications] = useState([]);
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState(``);
  const [medicationError, setMedicationError] = useState(null);
  const [dosageError, setDosageError] = useState(null);

  const fetchMedications = async () => {
    try {
      const medicationsRef = ref(
        db,
        `users/patients/${patientId}/prescription/${itemId}/medications`
      );
      const snapshot = await get(medicationsRef);

      if (snapshot.exists()) {
        const medicationsArray = Object.values(snapshot.val());
        setMedications(medicationsArray);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchMedications();
  }, [itemId, patientId]);

  const getMedicalUnitName = async () => {
    const Name = await AsyncStorage.getItem("HospitalName");
    setMedicalUnitName(Name);
  };
  getMedicalUnitName();

  const handleAddMedication = async () => {
    if (medication === "" || dosage === "") {
      setMedicationError("Required");
      setDosageError("Required");
      return;
    }

    if (medication.length < 6 && dosage.length < 6) {
      setMedication("");
      setDosage("");
      setMedicationError("Minimum length 6 letters.");
      setDosageError("Minimum length 6 letters.");
      return;
    }

    if (medication.length < 6) {
      setMedication("");
      setMedicationError("Minimum length 6 letters.");
      return;
    }
    if (dosage.length < 6) {
      setDosage("");
      setDosageError("Minimum length 6 letters.");
      return;
    }

    if (!/^[a-zA-Z0-9 ]+$/.test(medication)) {
      setMedication("");
      setMedicationError("Only letters and numbers allowed");
      return;
    }
    if (!/^[a-zA-Z0-9/ ]+$/.test(dosage)) {
      setDosage("");
      setDosageError("Only letters and numbers allowed");
      return;
    }

    try {
      if (medication && dosage) {
        const newMedication = { medication, dosage };
        const prescriptionRef = ref(
          db,
          `users/patients/${patientId}/prescription/${itemId}/medications`
        );

        const newMedicationRef = push(prescriptionRef, newMedication);
        const newItemId = newMedicationRef.key;
        newMedication.id = newItemId;
        set(newMedicationRef, newMedication);
        setMedications((prevData) => [...prevData, newMedication]);
        fetchMedications();

        setMedication("");
        setDosage(``);
        setDosageError(null);
        setMedicationError(null);
      }
    } catch (error) {}
  };

  const handleDeleteMedication = async (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this Medication?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const newMedications = medications.filter((med) => med.id !== id);
              const medDataRef = ref(
                db,
                `users/patients/${patientId}/prescription/${itemId}/medications/${id}`
              );
              await set(medDataRef, null);
              setMedications(newMedications);
            } catch (error) {}
          },
        },
      ]
    );
  };

  const renderMedicationItem = ({ item }) => (
    <View style={styles.medicationItem}>
      <View style={styles.row}>
        <Text style={styles.label}>
          Medication:{" "}
          <Text style={{ ...styles.value, fontWeight: "normal" }}>
            {item.medication}
          </Text>
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>
          Dosage:{" "}
          <Text style={{ ...styles.value, fontWeight: "normal" }}>
            {item.dosage}
          </Text>
        </Text>
      </View>
      {medicalUnitName === currentMedicalUnit && ( // Check if created by the current medical unit
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteMedication(item.id)}
        >
          <Text style={{ color: "white" }}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View
        style={
          medicalUnitName === currentMedicalUnit
            ? styles.container
            : { ...styles.container, backgroundColor: "white" }
        }
      >
        <View
          style={{
            marginBottom: 25,
            alignItems: "flex-start",
            borderRadius: 10,
            backgroundColor: "#fff",
            elevation: 3,
            margin: 10,
            marginVertical: 2,
            padding: 15,
          }}
        >
          <Text
            style={{ fontWeight: "700", fontSize: 15, textAlign: "center" }}
          >
            Doctor name:{" "}
            <Text style={{ fontWeight: "400", fontStyle: "italic" }}>
              {CreatedBy}
            </Text>
          </Text>
          <Text
            style={{
              fontWeight: "700",
              fontSize: 15,
              paddingTop: 5,
              textAlign: "center",
            }}
          >
            Diagnosis:{" "}
            <Text
              style={{
                fontWeight: "400",
                fontStyle: "italic",
              }}
            >
              {Diagnosis}
            </Text>
          </Text>
        </View>

        {medicalUnitName != currentMedicalUnit && (
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Medications:</Text>
        )}
        {medicalUnitName === currentMedicalUnit && ( // Check if logged-in medical unit matches the prescription's medical unit
          <>
            <View style={styles.formContainer}>
              <Text style={styles.label}>Medication:</Text>
              <TextInput
                style={styles.input}
                value={medication}
                multiline
                maxLength={22}
                onChangeText={(text) => setMedication(text)}
                placeholder={medicationError ? medicationError : ""}
                placeholderTextColor={medicationError ? "red" : "white"}
              />
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.label}> Dosage:{"     "}</Text>
              <TextInput
                style={styles.input}
                value={dosage}
                maxLength={25}
                onChangeText={(text) => setDosage(text)}
                placeholder={dosageError ? dosageError : ""}
                placeholderTextColor={dosageError ? "red" : "white"}
                multiline
                numberOfLines={2}
              />
            </View>

            <TouchableOpacity
              style={styles.checkEligibilityButton}
              onPress={handleAddMedication}
            >
              <Text style={styles.checkEligibilityButtonText}>
                Add Medication
              </Text>
            </TouchableOpacity>
          </>
        )}
        {medications.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>No medications prescriped yet.</Text>
          </View>
        ) : (
          <FlatList
            data={medications}
            renderItem={renderMedicationItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PresList;

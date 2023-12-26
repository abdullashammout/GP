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
import { set, ref, get, push } from "firebase/database";
import { db } from "../../../firebase";

const PresList = ({ route }) => {
  const { itemId, patientId } = route.params;
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
    } catch (error) {
      console.error("Error loading medications:", error);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, [itemId, patientId]);

  const handleAddMedication = async () => {
    if (medication === "" || dosage === "") {
      setMedicationError("Required");
      setDosageError("Required");
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
    } catch (error) {
      console.error("Error adding medication:", error);
    }
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
            } catch (error) {
              console.error("Error deleting item:", error);
            }
          },
        },
      ]
    );
  };

  const renderMedicationItem = ({ item }) => (
    <View style={styles.medicationItem}>
      <View style={styles.row}>
        <Text style={styles.label}>Medication:</Text>
        <Text style={[styles.value, styles.medication]}>
          {" "}
          {item.medication}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Dosage:</Text>
        <Text style={styles.value}> {item.dosage}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteMedication(item.id)}
      >
        <Text style={{ color: "white" }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Medication:</Text>
          <TextInput
            style={styles.input}
            value={medication}
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
          <Text style={styles.checkEligibilityButtonText}>Add Medication</Text>
        </TouchableOpacity>

        <FlatList
          data={medications}
          renderItem={renderMedicationItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PresList;

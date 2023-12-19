import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { set, ref, get, push } from "firebase/database";
import { db } from "../../../firebase";

const PresList = ({ route }) => {
  const { itemId, idd, itemName, medicalUnitName, patientId } = route.params;
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  formContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  medicationItem: {
    justifyContent: "space-between",
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#ADD8E6",
    borderRadius: 8,
    position: "relative",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#555",
  },
  medication: {
    fontStyle: "italic",
    color: "#777",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginLeft: 10,
    padding: 5,
    borderRadius: 8,
    backgroundColor: "white",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    right: 10,
    top: 50,
    transform: [{ translateY: -25 }],
  },
  row: {
    flexDirection: "row",
    padding: 4,
  },
  checkEligibilityButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  checkEligibilityButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default PresList;

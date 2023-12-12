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

const PrescriptionDetails = ({ route }) => {
  const { itemId, itemName, medicalUnitName, patientId } = route.params;
  const [medications, setMedications] = useState([]);

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
    </View>
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Medical unit Name:</Text>
          <Text style={styles.value}>{medicalUnitName}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Doctor Name:</Text>
          <Text style={styles.value}>{itemName}</Text>
        </View>
        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 22 }}>
          Medications
        </Text>

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
  row: {
    flexDirection: "row",
    padding: 4,
  },
});

export default PrescriptionDetails;

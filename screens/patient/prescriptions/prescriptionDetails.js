import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { ref, get } from "firebase/database";
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
        <Text style={styles.label}>Medication: </Text>
        <Text style={[styles.value, styles.medication]}>{item.medication}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Dosage: </Text>
        <Text style={styles.value}>{item.dosage}</Text>
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
        <View style={styles.header}>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Doctor Name:</Text>
            <Text style={styles.value}>Dr. {itemName}</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Medications</Text>

        {medications.length > 0 ? (
          <FlatList
            data={medications}
            renderItem={renderMedicationItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.flatlist}
          />
        ) : (
          <Text style={styles.noMedicationsText}>
            No medications prescribed.
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  medicationItem: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#B3E8CA",
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  medication: {
    fontStyle: "italic",
    color: "#777",
  },
  flatlist: {
    flexGrow: 0,
  },
  noMedicationsText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
  },
});

export default PrescriptionDetails;

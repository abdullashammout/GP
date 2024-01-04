import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ref, get, update } from "firebase/database";
import { db } from "../../firebase";
import styles from "../../styles/patientStyles/presDetailsStyle";

const Medications = ({ route }) => {
  const { itemId, patientId } = route.params;
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

  const handleSellMedication = async (medicationId) => {
    Alert.alert("Sell Confirmation", "Are you sure you sold the medication", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          try {
            // Update the local state to mark the medication as sold
            const updatedMedications = medications.map((medication) =>
              medication.id === medicationId
                ? { ...medication, isSold: !medication.isSold }
                : medication
            );
            setMedications(updatedMedications);

            // Update the database to mark the medication as sold
            const medicationRef = ref(
              db,
              `users/patients/${patientId}/prescription/${itemId}/medications/${medicationId}`
            );
            await update(medicationRef, {
              isSold: !medications.find((m) => m.id === medicationId)?.isSold,
            });
          } catch (error) {
            console.error("Error selling medication:", error);
          }
        },
      },
    ]);
  };

  const renderMedicationItem = ({ item }) => (
    <View
      style={[styles.medicationItem, item.isSold && styles.soldItemContainer]}
    >
      <View style={styles.row}>
        <Text style={styles.label}>
          Diagnosis:{" "}
          <Text
            style={{
              ...styles.value,
              fontWeight: "normal",
              ...styles.medication,
            }}
          >
            {item.diagnosis}
          </Text>
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>
          Medication:{" "}
          <Text
            style={{
              ...styles.value,
              fontWeight: "normal",
            }}
          >
            {item.medication}
          </Text>
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>
          Dosage:{" "}
          <Text
            style={{
              ...styles.value,
              fontWeight: "normal",
            }}
          >
            {item.dosage}
          </Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.sell,
            item.isSold ? { backgroundColor: "lightgreen" } : null,
          ]}
          onPress={() => handleSellMedication(item.id)}
          disabled={item.isSold}
        >
          <Text style={{ color: "white" }}>
            {item.isSold ? "Sold" : "Sell"}
          </Text>
        </TouchableOpacity>
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
        <Text style={styles.sectionHeader}>Medications :</Text>

        {medications.length > 0 ? (
          <FlatList
            data={medications}
            renderItem={renderMedicationItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.flatlist}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={styles.noMedicationsText}>
              No medications prescribed yet.
            </Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Medications;

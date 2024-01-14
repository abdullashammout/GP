import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { ref, get } from "firebase/database";
import { db } from "../../../firebase";
import styles from "../../../styles/patientStyles/presDetailsStyle";

const PrescriptionDetails = ({ route }) => {
  const { itemId, itemName, medicalUnitName, patientId } = route.params;
  const [Diagnosis, setDiagnosis] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [medications, setMedications] = useState([]);

  const fetchMedications = async () => {
    try {
      const medicationsRef = ref(
        db,
        `users/patients/${patientId}/prescription/${itemId}/medications`
      );
      const snapshot = await get(medicationsRef);

      if (snapshot.exists()) {
        const { diagnosis } = snapshot.val();
        const { createdBy } = snapshot.val();
        setDiagnosis(diagnosis);
        setCreatedBy(createdBy);
        const medicationsArray = Object.values(snapshot.val());
        setMedications(medicationsArray);
      }
    } catch (error) {}
  };
  const fetchDiagnosis = async () => {
    try {
      const medicationsRef = ref(
        db,
        `users/patients/${patientId}/prescription/${itemId}`
      );
      const snapshot = await get(medicationsRef);

      if (snapshot.exists()) {
        const { diagnosis } = snapshot.val();
        const { createdBy } = snapshot.val();
        setDiagnosis(diagnosis);
        setCreatedBy(createdBy);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchMedications();
    fetchDiagnosis();
  }, [itemId, patientId]);

  const renderMedicationItem = ({ item }) => (
    <View style={styles.medicationItem}>
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
            Doctor Name:{" "}
            <Text style={{ fontWeight: "400", fontStyle: "italic" }}>
              {createdBy}
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

export default PrescriptionDetails;

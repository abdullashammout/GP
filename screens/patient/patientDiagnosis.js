import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";
import styles from "../../styles/patientStyles/diagnosisStyle";

const PatientDiagnosis = ({ route }) => {
  const { userId } = route.params;
  const [diagnosis, setDiagnosis] = useState([]);

  const loadData = async () => {
    try {
      const diagnosisDataRef = ref(db, `users/patients/${userId}/Diagnosis`);
      const snapshot = await get(diagnosisDataRef);
      const loadedData = [];

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const itemData = childSnapshot.val();
          itemData.id = childSnapshot.key;
          loadedData.push(itemData);
        });
        setDiagnosis(loadedData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId, diagnosis]);

  return (
    <View style={styles.container}>
      {diagnosis.length === 0 ? (
        <View style={styles.noDiagnosisContainer}>
          <Text style={styles.noDiagnosisText}>You have no diagnosis yet.</Text>
        </View>
      ) : (
        <FlatList
          data={diagnosis}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.allergyItem}>
              <View style={styles.row}>
                <Text style={styles.label}>
                  Diagnosis:{" "}
                  <Text style={{ fontWeight: "normal" }}>{item.diagnosis}</Text>
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Hospital: </Text>
                <Text>{item.medicalUnit}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Doctor: </Text>
                <Text>{item.doctor}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Date: </Text>
                <Text>{item.date}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default PatientDiagnosis;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ref, get } from "firebase/database";
import { db } from "../../../firebase";

const PatientPrescription = ({ navigation, route }) => {
  const { userId } = route.params;
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const loadPrescriptions = async () => {
      try {
        const presDataRef = ref(db, `users/patients/${userId}/prescription`);
        const snapshot = await get(presDataRef);

        if (snapshot.exists()) {
          const loadedPrescriptions = [];

          snapshot.forEach((childSnapshot) => {
            const prescriptionData = {
              ...childSnapshot.val(),
              id: childSnapshot.key,
            };
            loadedPrescriptions.push(prescriptionData);
          });

          if (loadedPrescriptions.length > 0) {
            setPrescriptions(loadedPrescriptions);
          } else {
            console.log("No prescriptions found.");
          }
        } else {
          console.log("No data found in snapshot.");
        }
      } catch (error) {
        console.error("Error loading prescriptions:", error);
      }
    };

    loadPrescriptions();
  }, [userId]);

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{`Prescription ${index + 1}`}</Text>
      <Text>{`Doctor name: Dr.${item.createdBy}`}</Text>
      <Text>{`Date: ${item.date}`}</Text>
      <Text>{`Time: ${item.time}`}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: "#3498db" }}
          onPress={() =>
            navigation.navigate("patientMedications", {
              itemId: item.id,
              itemName: item.createdBy,
              medicalUnitName: item.medicalUnitName,
              patientId: userId,
            })
          }
        >
          <Text style={{ color: "white" }}>View Medications</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {prescriptions.length > 0 ? (
        <FlatList
          data={prescriptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <View style={styles.noPrescriptionsContainer}>
          <Text style={styles.noPrescriptionsText}>
            You have no prescriptions yet.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  itemContainer: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  button: {
    alignSelf: "flex-end",
    backgroundColor: "#e74c3c",
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
  },
  buttonContainer: {
    position: "absolute",
    right: 10,
  },
  noPrescriptionsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPrescriptionsText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
});

export default PatientPrescription;

import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
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
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>My Prescriptions</Text>
      {prescriptions.length > 0 ? (
        <FlatList
          data={prescriptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text>No prescriptions available for this patient.</Text>
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
});

export default PatientPrescription;

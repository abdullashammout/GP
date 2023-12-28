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
    <TouchableOpacity
      style={[styles.itemContainer, item.isSold && styles.soldItemContainer]}
      onPress={() =>
        navigation.navigate("patientMedications", {
          itemId: item.id,
          itemName: item.createdBy,
          medicalUnitName: item.medicalUnitName,
          patientId: userId,
        })
      }
    >
      <Text style={styles.itemHeaderText}>{`Prescription ${index + 1}`}</Text>
      <Text
        style={styles.itemText}
      >{`Medical Unit: ${item.medicalUnitName}`}</Text>
      <Text style={styles.itemText}>{`Doctor: ${item.createdBy}`}</Text>
      <Text style={styles.itemText}>{`Date: ${item.date}`}</Text>
      <Text style={styles.itemText}>{`Time: ${item.time}`}</Text>
      {item.isSold ? <Text style={styles.soldText}>Sold</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {prescriptions.length > 0 ? (
        <FlatList
          data={prescriptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatlistContainer}
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
  itemContainer: {
    backgroundColor: "#3498db",
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
  },
  flatlistContainer: {
    paddingBottom: 16,
  },
  itemHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
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
  soldText: {
    position: "absolute",
    right: 20,
    top: 70,
    fontSize: 16,
    color: "black", // or any color you prefer for sold prescriptions
    fontWeight: "bold",
    opacity: 0.7,
  },
  soldItemContainer: {
    opacity: 0.7,
  },
});

export default PatientPrescription;

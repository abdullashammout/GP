import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";

const PharPrescription = ({ navigation, route }) => {
  const { patientId } = route.params;
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const loadPrescriptions = async () => {
      try {
        const presDataRef = ref(db, `users/patients/${patientId}/prescription`);
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
  }, [patientId]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate("patientMedications", {
          itemId: item.id,
          itemName: item.createdBy,
          medicalUnitName: item.medicalUnitName,
          patientId: patientId,
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
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{ margin: 20, marginTop: 15 }}>
        <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}>
          Patient Prescriptions
        </Text>
      </View>
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
            This patient have no prescriptions yet.
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
});

export default PharPrescription;

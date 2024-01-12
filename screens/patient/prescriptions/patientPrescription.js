import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { ref, get } from "firebase/database";
import { db } from "../../../firebase";
import styles from "../../../styles/patientStyles/prescriptionStyle";

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
          }
        } else {
        }
      } catch (error) {}
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

export default PatientPrescription;

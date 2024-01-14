import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { ref, get } from "firebase/database";
import { db } from "../../../firebase";
import styles from "../../../styles/patientStyles/treatmentStyle";

const PatientTreatments = ({ navigation, route }) => {
  const { userId } = route.params;
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const treatDataRef = ref(db, `users/patients/${userId}/Treatments`);
        const snapshot = await get(treatDataRef);
        const loadedData = [];

        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const itemData = childSnapshot.val();
            itemData.id = childSnapshot.key;
            loadedData.push(itemData);
          });

          setTreatments(loadedData);
        }
      } catch (error) {}
    };

    loadData();
  }, [userId, treatments]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.treatmentItem}
      onPress={() =>
        navigation.navigate("pTreatDetails", {
          name: item.treatmentName,
          itemId: item.id,
          itemName: item.createdBy,
          medicalUnitName: item.medicalUnitName,
          patientId: userId,
        })
      }
    >
      <Text
        style={styles.itemHeaderText}
      >{`Treatment: ${item.treatmentName}`}</Text>
      <Text
        style={styles.itemText}
      >{`Hospital name: ${item.medicalUnitName}`}</Text>
      <Text style={styles.itemText}>{`Doctor name: ${item.createdBy}`}</Text>
      <Text style={styles.itemText}>{`Date: ${item.date}`}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {treatments.length > 0 ? (
        <FlatList
          data={treatments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatlistContainer}
        />
      ) : (
        <View style={styles.noTreatmentsContainer}>
          <Text style={styles.noTreatmentsText}>
            You have no treatments yet.
          </Text>
        </View>
      )}
    </View>
  );
};

export default PatientTreatments;

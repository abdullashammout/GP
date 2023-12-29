import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ref, get } from "firebase/database";
import { db } from "../../../firebase";

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
      } catch (error) {
        console.error("Error loading data:", error);
      }
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
      <Text style={styles.itemText}>{`Hospital: ${item.medicalUnitName}`}</Text>
      <Text style={styles.itemText}>{`Doctor: ${item.createdBy}`}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  treatmentItem: {
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
  noTreatmentsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noTreatmentsText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
});

export default PatientTreatments;

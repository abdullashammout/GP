import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";

const PatientAllergies = ({ route }) => {
  const { userId } = route.params;
  const [allergies, setAllergies] = useState([]);

  const loadData = async () => {
    try {
      const AllergyDataRef = ref(db, `users/patients/${userId}/Allergy`);
      const snapshot = await get(AllergyDataRef);
      const loadedData = [];

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const itemData = childSnapshot.val();
          itemData.id = childSnapshot.key;
          loadedData.push(itemData);
        });
        setAllergies(loadedData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId, allergies]);

  return (
    <View style={styles.container}>
      {allergies.length === 0 ? (
        <View style={styles.noAllergiesContainer}>
          <Text style={styles.noAllergiesText}>You have no allergies yet.</Text>
        </View>
      ) : (
        <FlatList
          data={allergies}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.allergyItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Hospital:</Text>
                <Text>{item.medicalUnitName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Name:</Text>
                <Text>{item.allergyName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Date:</Text>
                <Text>{item.formattedDate}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  noAllergiesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noAllergiesText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
  allergyItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "lightblue", // Light Pastel Red
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    marginRight: 5,
  },
});

export default PatientAllergies;

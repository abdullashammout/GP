import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";
import styles from "../../styles/patientStyles/allergyStyle";

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
    } catch (error) {}
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
                <Text style={styles.label}>Name:</Text>
                <Text>{item.allergyName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Hospital:</Text>
                <Text>{item.medicalUnitName}</Text>
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

export default PatientAllergies;

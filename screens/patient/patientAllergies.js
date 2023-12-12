import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { set, ref, push, get } from "firebase/database";
import { db } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        const sortedData = loadedData.sort((a, b) => a.id.localeCompare(b.id));
        setAllergies(sortedData);
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
      <View style={styles.inputContainer}></View>
      {allergies.length === 0 ? (
        <View style={styles.noAllergiesContainer}>
          <Text style={styles.noAllergiesText}>You have no Allergies yet.</Text>
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
                <Text style={styles.label}> Date:</Text>
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
  allergyItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#f1f1f1",
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

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#eaeaea",
    borderWidth: 1,
    marginRight: 10,
    paddingLeft: 10,
  },
  addButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    position: "absolute",
    alignSelf: "flex-end",
    backgroundColor: "#e74c3c",
    padding: 5,
    borderRadius: 5,
    marginTop: 17,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
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
});
export default PatientAllergies;

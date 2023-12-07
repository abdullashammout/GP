import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import { set, ref, push, get } from "firebase/database";
import { db } from "../../firebase";

const Vaccine = ({ navigation, route }) => {
  const { patientId } = route.params;
  const [vaccines, setVaccines] = useState([]);
  const [vaccineName, setVaccineName] = useState("");
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;

  const loadData = async () => {
    try {
      const presDataRef = ref(db, `users/patients/${patientId}/Vaccine`);
      const snapshot = await get(presDataRef);
      const loadedData = [];

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const itemData = childSnapshot.val();
          itemData.id = childSnapshot.key;
          loadedData.push(itemData);
        });
        const sortedData = loadedData.sort((a, b) => a.id.localeCompare(b.id));
        setVaccines(sortedData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };
  useEffect(() => {
    loadData();
  }, [patientId, vaccines]);

  const addVaccine = async () => {
    try {
      if (vaccineName) {
        const newVaccine = { vaccineName, formattedDate };

        const presDataRef = ref(db, `users/patients/${patientId}/Vaccine`);

        const newPrescriptionRef = push(presDataRef, newVaccine);

        const newItemId = newPrescriptionRef.key;
        newVaccine.id = newItemId;

        set(newPrescriptionRef, newVaccine);
        setVaccines((prevData) => [...prevData, newVaccine]);

        setVaccineName("");
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Vaccine Tracker</Text>

      <TextInput
        style={styles.input}
        placeholder="Vaccine Name"
        value={vaccineName}
        onChangeText={(text) => setVaccineName(text)}
      />

      <Button title="Add Vaccine" onPress={addVaccine} />

      <Text style={styles.historyHeader}>Vaccine History</Text>
      <FlatList
        data={vaccines}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.vaccineItem}>
            <Text>Vaccine: {item.name}</Text>
            <Text>Date: {formattedDate}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  historyHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  vaccineItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#ADD8E6",
    borderRadius: 8,
  },
});

export default Vaccine;

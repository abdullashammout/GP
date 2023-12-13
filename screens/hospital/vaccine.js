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
import AsyncStorage from "@react-native-async-storage/async-storage";

const Vaccine = ({ navigation, route }) => {
  const { patientId } = route.params;
  const [vaccines, setVaccines] = useState([]);
  const [vaccineName, setVaccineName] = useState("");
  const [medicalUnitName, setMedicalUnitName] = useState("");
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
  const getMedicalUnitName = async () => {
    const Name = await AsyncStorage.getItem("HospitalName");
    setMedicalUnitName(Name);
  };
  getMedicalUnitName();

  const addVaccine = async () => {
    try {
      if (vaccineName) {
        const newVaccine = { vaccineName, formattedDate, medicalUnitName };

        const presDataRef = ref(db, `users/patients/${patientId}/Vaccine`);

        const newVaccineRef = push(presDataRef, newVaccine);

        const newItemId = newVaccineRef.key;
        newVaccine.id = newItemId;

        set(newVaccineRef, newVaccine);
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
      {vaccines.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No Vaccines recorded for this patient.</Text>
        </View>
      ) : (
        <FlatList
          data={vaccines}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.vaccineItem}>
              <Text>
                Medical Unit: {"  "}
                {item.medicalUnitName}
              </Text>
              <Text>
                Vaccine Name: {"  "}
                {item.vaccineName}
              </Text>
              <Text>
                Date: {"  "}
                {item.formattedDate}
              </Text>
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
    padding: 16,
    backgroundColor: "#fff",
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
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
  },
});

export default Vaccine;

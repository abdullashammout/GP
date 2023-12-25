import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { set, ref, push, get } from "firebase/database";
import { db } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChronicIllness = ({ route }) => {
  const { patientId } = route.params;
  const [chronicIllnesses, setChronicIllnesses] = useState([]);
  const [medicalUnitName, setMedicalUnitName] = useState("");
  const [newChronic, setNewChronic] = useState("");
  const [Error, setError] = useState(null);
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;

  useEffect(() => {
    const loadData = async () => {
      try {
        const presDataRef = ref(db, `users/patients/${patientId}/Chronic`);
        const snapshot = await get(presDataRef);
        const loadedData = [];

        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const itemData = childSnapshot.val();
            itemData.id = childSnapshot.key;
            loadedData.push(itemData);
          });
          setChronicIllnesses(loadedData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, [patientId]);

  const getMedicalUnitName = async () => {
    const Name = await AsyncStorage.getItem("HospitalName");
    setMedicalUnitName(Name);
  };
  getMedicalUnitName();

  const addChronic = async () => {
    if (newChronic === "") {
      setNewChronic("");
      setError("Please enter chronic disease name");
      return;
    }
    try {
      if (newChronic) {
        const newChronicIllness = {
          newChronic,
          formattedDate,
          medicalUnitName,
        };

        const presDataRef = ref(db, `users/patients/${patientId}/Chronic`);

        const newChronicIllnessRef = push(presDataRef, newChronicIllness);

        const newItemId = newChronicIllnessRef.key;
        newChronicIllness.id = newItemId;

        set(newChronicIllnessRef, newChronicIllness);
        setChronicIllnesses((prevData) => [...prevData, newChronicIllness]);

        setNewChronic("");
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const deleteChronic = async (id) => {
    try {
      const newChronicIllnesss = chronicIllnesses.filter(
        (item) => item.id !== id
      );

      const presDataRef = ref(db, `users/patients/${patientId}/Chronic/${id}`);
      await set(presDataRef, null);

      setChronicIllnesses(newChronicIllnesss);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={Error ? Error : "Enter new chronic Disease"}
          placeholderTextColor={Error ? "red" : "gray"}
          value={newChronic}
          onChangeText={(text) => setNewChronic(text)}
        />

        <TouchableOpacity style={styles.addButton} onPress={addChronic}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      {chronicIllnesses.length === 0 ? (
        <Text>No chronic Disease recorded for this patient.</Text>
      ) : (
        <FlatList
          data={chronicIllnesses}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.chronicItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.textin}>{item.newChronic}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Hospital:</Text>
                <Text style={styles.textin}>{item.medicalUnitName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.textin}>{item.formattedDate}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteChronic(item.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
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
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    marginRight: 5,
    paddingLeft: 5,
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
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    paddingLeft: 10,
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    padding: 8, // Adjust the padding to make the button fit better
    borderRadius: 5,
    position: "absolute",
    bottom: 5,
    right: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  chronicItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#ADD8E6",
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  textin: {
    paddingRight: 5,
  },
});

export default ChronicIllness;

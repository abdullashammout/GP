import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import styles from "../../styles/hospitalStyles/chronicStyles";
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
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this Chronic Disease?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const newChronicIllnesss = chronicIllnesses.filter(
                (item) => item.id !== id
              );

              const presDataRef = ref(
                db,
                `users/patients/${patientId}/Chronic/${id}`
              );
              await set(presDataRef, null);

              setChronicIllnesses(newChronicIllnesss);
            } catch (error) {
              console.error("Error deleting item:", error);
            }
          },
        },
      ]
    );
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
      </View>
      <TouchableOpacity style={styles.addButton} onPress={addChronic}>
        <Text
          style={{ ...styles.buttonText, fontWeight: "bold", fontSize: 16 }}
        >
          Add Chronic Disease
        </Text>
      </TouchableOpacity>
      <Text style={styles.header}>Chronic Diseases History</Text>
      {chronicIllnesses.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No chronic Disease recorded for this patient.</Text>
        </View>
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

export default ChronicIllness;

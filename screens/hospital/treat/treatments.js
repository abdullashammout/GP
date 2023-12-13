import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set, ref, get, push } from "firebase/database";
import { db } from "../../../firebase";

const TreatmentList = ({ navigation, route }) => {
  const { patientId } = route.params;
  const [treatments, setTreatments] = useState([]);
  const [treatmentName, setTreatmentName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [medicalUnitName, setMedicalUnitName] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const treatDataRef = ref(db, `users/patients/${patientId}/Treatments`);
        const snapshot = await get(treatDataRef);
        const loadedData = [];

        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const itemData = childSnapshot.val();
            itemData.id = childSnapshot.key;
            loadedData.push(itemData);
          });
          const sortedData = loadedData.sort((a, b) =>
            a.id.localeCompare(b.id)
          );
          setTreatments(sortedData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [patientId, treatments]);

  const getMedicalUnitName = async () => {
    const Name = await AsyncStorage.getItem("HospitalName");
    setMedicalUnitName(Name);
  };
  getMedicalUnitName();

  const handleDeleteItem = async (id) => {
    try {
      const newData = treatments.filter((item) => item.id !== id);

      const treatidRef = ref(
        db,
        `users/patients/${patientId}/Treatments/${id}`
      );
      await set(treatidRef, null);
      setTreatments(newData);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleAddItem = async () => {
    if (treatmentName && doctorName) {
      try {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}/${
          currentDate.getMonth() + 1
        }/${currentDate.getFullYear()}`;

        const newItemData = {
          treatmentName: treatmentName,
          createdBy: doctorName,
          medicalUnitName: medicalUnitName,
          date: formattedDate,
        };

        const treatDataRef = ref(db, `users/patients/${patientId}/Treatments`);

        const newTreatmentRef = push(treatDataRef, newItemData);

        const newItemId = newTreatmentRef.key;
        newItemData.id = newItemId;

        set(newTreatmentRef, newItemData);
        setTreatments((prevData) => [...prevData, newItemData]);

        setTreatmentName("");
        setDoctorName("");
      } catch (error) {
        console.error("Error adding item:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Treatment List</Text>

      <TextInput
        style={styles.input}
        placeholder="Doctor Name"
        value={doctorName}
        onChangeText={(text) => setDoctorName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Treatment Name"
        value={treatmentName}
        onChangeText={(text) => setTreatmentName(text)}
      />
      <Button title="Add Treatment" onPress={handleAddItem} />

      <Text style={styles.listHeader}>Treatments</Text>
      {treatments.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No Treatments recorded for this patient.</Text>
        </View>
      ) : (
        <FlatList
          data={treatments}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.treatmentItem}>
              <View>
                <Text style={{ fontWeight: "bold" }}>
                  Medical Unit: {item.medicalUnitName}{" "}
                </Text>
              </View>
              <Text>Treatment: {item.treatmentName}</Text>
              <Text>Doctor: {item.createdBy}</Text>
              <Text>Date : {item.date} </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={{ ...styles.button, backgroundColor: "#3498db" }}
                  onPress={() =>
                    navigation.navigate("TreatmentDetails", {
                      name: item.treatmentName,
                      itemId: item.id,
                      itemName: item.createdBy,
                      medicalUnitName: item.medicalUnitName,
                      patientId: patientId,
                    })
                  }
                >
                  <Text style={{ color: "white" }}>View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleDeleteItem(item.id)}
                >
                  <Text style={{ color: "white" }}>Delete</Text>
                </TouchableOpacity>
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
  listHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  treatmentItem: {
    justifyContent: "space-between",
    backgroundColor: "#f1f1f1",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  button: {
    alignSelf: "flex-end",
    backgroundColor: "#e74c3c",
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
  },
  buttonContainer: {
    position: "absolute",
    right: 10,
  },
});

export default TreatmentList;

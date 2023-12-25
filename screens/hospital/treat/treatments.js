import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set, ref, get, push } from "firebase/database";
import { db } from "../../../firebase";

const TreatmentList = ({ navigation, route }) => {
  const { patientId } = route.params;
  const [treatments, setTreatments] = useState([]);
  const [treatmentName, setTreatmentName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [treatNameError, setTreatNameError] = useState(null);
  const [doctorNameError, setDoctorNameError] = useState(null);
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

          setTreatments(loadedData);
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
    if (treatmentName === "" || doctorName === "") {
      setDoctorName("");
      setTreatmentName("");
      setDoctorNameError("Required");
      setTreatNameError("Required");
      return;
    }
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
      setDoctorNameError(null);
      setTreatNameError(null);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder={doctorNameError ? doctorNameError : "Doctor Name"}
          placeholderTextColor={doctorNameError ? "red" : "gray"}
          value={doctorName}
          onChangeText={(text) => setDoctorName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder={treatNameError ? treatNameError : "Treatment Name"}
          placeholderTextColor={treatNameError ? "red" : "gray"}
          value={treatmentName}
          onChangeText={(text) => setTreatmentName(text)}
        />
        <TouchableOpacity
          style={styles.checkEligibilityButton}
          onPress={handleAddItem}
        >
          <Text style={styles.checkEligibilityButtonText}>Add Treatment</Text>
        </TouchableOpacity>

        <Text style={styles.listHeader}>Treatments History</Text>
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
              <TouchableOpacity
                style={styles.treatmentItem}
                onPress={() =>
                  navigation.navigate(
                    "TreatmentDetails",
                    {
                      name: item.treatmentName,
                      itemId: item.id,
                      itemName: item.createdBy,
                      medicalUnitName: item.medicalUnitName,
                      patientId: patientId,
                    },
                    setDoctorNameError(null),
                    setTreatNameError(null)
                  )
                }
              >
                <View>
                  <Text
                    style={{ fontWeight: "bold", color: "white", fontSize: 16 }}
                  >
                    Treatment: {item.treatmentName}{" "}
                  </Text>
                </View>
                <Text style={styles.dateText}>
                  Medical Unit: {item.medicalUnitName}
                </Text>
                <Text style={styles.dateText}>Doctor: {item.createdBy}</Text>
                <Text style={styles.dateText}>Date: {item.date} </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleDeleteItem(item.id)}
                  >
                    <Text style={{ color: "white" }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
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
  dateText: {
    marginTop: 5,
    color: "white", // black for text
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
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
    backgroundColor: "#3498db",
    borderRadius: 8,
    elevation: 3, // Add elevation for shadow on Android
    shadowColor: "#000", // Add shadow for iOS
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  buttonContainer: {
    position: "absolute",
    alignSelf: "flex-end",
    top: 80,
    right: 5,
  },
  button: {
    backgroundColor: "#e74c3c",
    padding: 10,
    marginLeft: 5, // Add some space between buttons
    borderRadius: 5,
  },
  checkEligibilityButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  checkEligibilityButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default TreatmentList;

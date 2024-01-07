import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  FlatList,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import styles from "../../../styles/hospitalStyles/treatmentStyles";
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
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this Treatment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
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
          },
        },
      ]
    );
  };
  const handleAddItem = async () => {
    if (treatmentName === "" || doctorName === "") {
      setDoctorNameError("Required");
      setTreatNameError("Required");
      return;
    }
    if (doctorName.length < 6) {
      setDoctorName("");
      setDoctorNameError("Minimum length 6 letters.");
      return;
    }
    if (treatmentName.length < 6) {
      setTreatmentName("");
      setTreatNameError("Minimum length 6 letters.");
      return;
    }
    if (!/^[a-zA-Z\s]*$/.test(doctorName)) {
      setDoctorName("");
      setDoctorNameError("only letters allowed.");
      return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(treatmentName)) {
      setTreatmentName("");
      setTreatNameError("Only letters and numbers allowed");
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
        <Text style={{ bottom: 3 }}>Doctor Name: </Text>
        <TextInput
          style={styles.input}
          placeholder={
            doctorNameError ? doctorNameError : "First Name & Last Name"
          }
          placeholderTextColor={doctorNameError ? "red" : "gray"}
          value={doctorName}
          onChangeText={(text) => setDoctorName(text)}
          maxLength={22}
        />
        <Text style={{ bottom: 3 }}>Treatment Name: </Text>

        <TextInput
          style={styles.input}
          placeholder={treatNameError ? treatNameError : "Treatment Name"}
          placeholderTextColor={treatNameError ? "red" : "gray"}
          value={treatmentName}
          onChangeText={(text) => setTreatmentName(text)}
          maxLength={22}
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
                      currentMedicalUnit: item.medicalUnitName,
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
                {item.medicalUnitName === medicalUnitName && (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleDeleteItem(item.id)}
                    >
                      <Text style={{ color: "white" }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TreatmentList;

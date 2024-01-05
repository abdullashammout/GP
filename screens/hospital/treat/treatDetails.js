import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import styles from "../../../styles/hospitalStyles/detailsTreatStyles";
import { set, ref, get, push } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../../firebase";

const TreatmentDetails = ({ route }) => {
  const { name, itemId, patientId, currentMedicalUnit } = route.params;
  const [details, setDetails] = useState([]);
  const [treatmentDetails, setTreatmentDetails] = useState(``);
  const [treatmentDetailsError, setTreatmentDetailsError] = useState(null);
  const [medicalUnitName, setMedicalUnitName] = useState("");
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;
  const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

  const fetchTreatmentDetails = async () => {
    try {
      const treatDetailsRef = ref(
        db,
        `users/patients/${patientId}/Treatments/${itemId}/TreatmentDetails`
      );
      const snapshot = await get(treatDetailsRef);

      if (snapshot.exists()) {
        const detailsArray = Object.values(snapshot.val());
        setDetails(detailsArray);
      }
    } catch (error) {
      console.error("Error loading details:", error);
    }
  };
  const getMedicalUnitName = async () => {
    const Name = await AsyncStorage.getItem("HospitalName");
    setMedicalUnitName(Name);
  };
  getMedicalUnitName();

  useEffect(() => {
    fetchTreatmentDetails();
  }, [itemId, patientId]);

  const handleAddTreatmentDetails = async () => {
    if (treatmentDetails === "") {
      setTreatmentDetails("");
      setTreatmentDetailsError("Required");
      return;
    }
    if (treatmentDetails.length < 6) {
      setTreatmentDetails("");
      setTreatmentDetailsError("Minimum length 6 letters.");
      return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(treatmentDetails)) {
      setTreatmentDetails("");
      setTreatmentDetailsError("Only letters and numbers allowed");
      return;
    }

    try {
      const newTreatmentDetails = {
        treatmentDetails,
        formattedDate,
        formattedTime,
      };
      const DetailsRef = ref(
        db,
        `users/patients/${patientId}/Treatments/${itemId}/TreatmentDetails`
      );

      const newDetailsRef = push(DetailsRef, newTreatmentDetails);
      const newItemId = newDetailsRef.key;
      newTreatmentDetails.id = newItemId;
      set(newDetailsRef, newTreatmentDetails);
      setDetails((prevData) => [...prevData, newTreatmentDetails]);
      fetchTreatmentDetails();

      setTreatmentDetails(``);
      setTreatmentDetailsError("");
    } catch (error) {
      console.error("Error adding medication:", error);
    }
  };
  const handleDeleteTreatmentDetails = async (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this Treatment Details?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const newTreatmentDetails = details.filter(
                (med) => med.id !== id
              );
              const detailsDataRef = ref(
                db,
                `users/patients/${patientId}/Treatments/${itemId}/TreatmentDetails/${id}`
              );
              await set(detailsDataRef, null);
              setDetails(newTreatmentDetails);
            } catch (error) {
              console.error("Error deleting item:", error);
            }
          },
        },
      ]
    );
  };
  const renderDetailsItem = ({ item }) => (
    <View style={styles.medicationItem}>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsLabel}>Details:</Text>
        <Text style={[styles.value, styles.medication]}>
          {item.treatmentDetails}
        </Text>
      </View>
      <Text style={{ color: "#fff" }}>
        _______________________________________________
      </Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsLabel}>Date:</Text>
        <Text style={styles.value}>{item.formattedDate}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsLabel}>Time:</Text>
        <Text style={styles.value}>{item.formattedTime}</Text>
      </View>
      {medicalUnitName === currentMedicalUnit && ( // Check if logged-in medical unit matches the prescription's medical unit
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTreatmentDetails(item.id)}
        >
          <Text style={{ color: "white" }}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View
        style={
          medicalUnitName === currentMedicalUnit
            ? styles.container
            : { ...styles.container, backgroundColor: "white" }
        }
      >
        {medicalUnitName === currentMedicalUnit && ( // Check if logged-in medical unit matches the prescription's medical unit
          <>
            <View style={styles.formContainer}>
              <Text style={styles.label}>Details:</Text>
              <TextInput
                style={styles.input}
                value={treatmentDetails}
                multiline
                onChangeText={(text) => setTreatmentDetails(text)}
                placeholder={treatmentDetailsError ? treatmentDetailsError : ""}
                placeholderTextColor={treatmentDetailsError ? "red" : "white"}
                maxLength={50}
              />
            </View>

            <TouchableOpacity
              style={styles.checkEligibilityButton}
              onPress={handleAddTreatmentDetails}
            >
              <Text style={styles.checkEligibilityButtonText}>Add Details</Text>
            </TouchableOpacity>
          </>
        )}
        {details.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>No details recorded for this treatment yet.</Text>
          </View>
        ) : (
          <FlatList
            data={details}
            renderItem={renderDetailsItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TreatmentDetails;

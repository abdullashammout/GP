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
  StyleSheet,
} from "react-native";
import { set, ref, get, push } from "firebase/database";
import { db } from "../../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StayList = ({ route }) => {
  const { itemId, patientId, currentMedicalUnit } = route.params;
  const [details, setDetails] = useState([]);
  const [entryDetails, setEntryDetails] = useState(``);
  const [entryError, setEntryError] = useState(null);
  const [medicalUnitName, setMedicalUnitName] = useState("");
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;
  const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

  const fetchEntryDetails = async () => {
    try {
      const EntryDetailsRef = ref(
        db,
        `users/patients/${patientId}/HospitalStay/${itemId}/Details`
      );
      const snapshot = await get(EntryDetailsRef);

      if (snapshot.exists()) {
        const EntryDetailsArray = Object.values(snapshot.val());
        setDetails(EntryDetailsArray);
      }
    } catch (error) {
      console.error("Error loading EntryDetails:", error);
    }
  };

  useEffect(() => {
    fetchEntryDetails();
  }, [itemId, patientId]);
  const getMedicalUnitName = async () => {
    const Name = await AsyncStorage.getItem("HospitalName");
    setMedicalUnitName(Name);
  };
  getMedicalUnitName();

  const handleAddEntryDetails = async () => {
    if (entryDetails === "") {
      setEntryError("Required");
      return;
    }

    try {
      const newEntryDetails = { entryDetails, formattedDate, formattedTime };
      const entryDetailsRef = ref(
        db,
        `users/patients/${patientId}/HospitalStay/${itemId}/Details`
      );

      const newEntryDetailsRef = push(entryDetailsRef, newEntryDetails);
      const newItemId = newEntryDetailsRef.key;
      newEntryDetails.id = newItemId;
      set(newEntryDetailsRef, newEntryDetails);
      setDetails((prevData) => [...prevData, newEntryDetails]);
      fetchEntryDetails();

      setEntryDetails("");
      setEntryError(null);
    } catch (error) {
      console.error("Error adding Entry Details:", error);
    }
  };

  const handleDeleteEntryDetails = async (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this entry Details?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const newDetails = details.filter((med) => med.id !== id);
              const EntryDataRef = ref(
                db,
                `users/patients/${patientId}/HospitalStay/${itemId}/Details/${id}`
              );
              await set(EntryDataRef, null);
              setDetails(newDetails);
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
          {item.entryDetails}
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
      {medicalUnitName === currentMedicalUnit && ( // Check if created by the current medical unit
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteEntryDetails(item.id)}
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
                value={entryDetails}
                multiline
                onChangeText={(text) => setEntryDetails(text)}
                placeholder={entryError ? entryError : ""}
                placeholderTextColor={entryError ? "red" : "white"}
              />
            </View>

            <TouchableOpacity
              style={styles.checkEligibilityButton}
              onPress={handleAddEntryDetails}
            >
              <Text style={styles.checkEligibilityButtonText}>Add Details</Text>
            </TouchableOpacity>
          </>
        )}
        {details.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>No details recoreded for this hospital entry yet.</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  formContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  medicationItem: {
    marginVertical: 10,
    backgroundColor: "#aed6f1", // Adjust the background color
    borderRadius: 12,
    padding: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#555",
  },
  medication: {
    paddingRight: 80,
    fontStyle: "italic",
    color: "#777",
  },
  input: {
    flex: 1,
    height: 80,
    borderColor: "gray",
    borderWidth: 1,
    marginLeft: 10,
    padding: 5,
    borderRadius: 8,
    backgroundColor: "white",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    right: 10,
    bottom: 30,
  },
  row: {
    flexDirection: "row",
  },
  detailsContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailsLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
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

export default StayList;

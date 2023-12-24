import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { set, ref, get, push } from "firebase/database";
import { db } from "../../../firebase";

const PatientTreatDetails = ({ route }) => {
  const { name, itemId, itemName, medicalUnitName, patientId } = route.params;
  const [details, setDetails] = useState([]);

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

  useEffect(() => {
    fetchTreatmentDetails();
  }, [itemId, patientId]);

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
    </View>
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <View style={styles.formContainer}></View>

        <FlatList
          data={details}
          renderItem={renderDetailsItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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
    alignSelf: "center",
  },
  formContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  medicationItem: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#B3E8CA",
    borderRadius: 8,
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
});

export default PatientTreatDetails;

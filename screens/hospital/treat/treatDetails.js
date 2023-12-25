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

const TreatmentDetails = ({ route }) => {
  const { name, itemId, patientId } = route.params;
  const [details, setDetails] = useState([]);
  const [treatmentDetails, setTreatmentDetails] = useState(``);
  const [treatmentDetailsError, setTreatmentDetailsError] = useState(null);
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

  useEffect(() => {
    fetchTreatmentDetails();
  }, [itemId, patientId]);

  const handleAddTreatmentDetails = async () => {
    if (treatmentDetails === "") {
      setTreatmentDetails("");
      setTreatmentDetailsError("Required");
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
    try {
      const newTreatmentDetails = details.filter((med) => med.id !== id);
      const detailsDataRef = ref(
        db,
        `users/patients/${patientId}/Treatments/${itemId}/TreatmentDetails/${id}`
      );
      await set(detailsDataRef, null);
      setDetails(newTreatmentDetails);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
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
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTreatmentDetails(item.id)}
      >
        <Text style={{ color: "white" }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Treatment: </Text>
          <Text>{name}</Text>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Details:</Text>
          <TextInput
            style={styles.input}
            value={treatmentDetails}
            multiline
            onChangeText={(text) => setTreatmentDetails(text)}
            placeholder={treatmentDetailsError ? treatmentDetailsError : ""}
            placeholderTextColor={treatmentDetailsError ? "red" : "white"}
          />
        </View>

        <TouchableOpacity
          style={styles.checkEligibilityButton}
          onPress={handleAddTreatmentDetails}
        >
          <Text style={styles.checkEligibilityButtonText}>Add Details</Text>
        </TouchableOpacity>

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
    padding: 15,
    backgroundColor: "#ADD8E6",
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
export default TreatmentDetails;

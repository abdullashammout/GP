import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import { ref, get } from "firebase/database";
import { db } from "../../../firebase";

const PatientStayDetails = ({ route }) => {
  const { itemId, patientId } = route.params;
  const [details, setDetails] = useState([]);

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
    </View>
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        {details.length === 0 ? (
          <View
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <Text>This Hospital Entry has no details yet</Text>
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
    backgroundColor: "#fff",
  },
  medicationItem: {
    marginVertical: 10,
    backgroundColor: "#aed6f1", // Adjust the background color
    borderRadius: 12,
    padding: 15,
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

export default PatientStayDetails;

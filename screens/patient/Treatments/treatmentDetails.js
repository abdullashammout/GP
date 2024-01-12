import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { ref, get } from "firebase/database";
import { db } from "../../../firebase";
import styles from "../../../styles/patientStyles/treatDetailsStyle";

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
    } catch (error) {}
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
        {details.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>This Treatment has no details yet.</Text>
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

export default PatientTreatDetails;

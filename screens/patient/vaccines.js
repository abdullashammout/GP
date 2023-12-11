import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";

const Vaccines = ({ navigation, route }) => {
  const { userId } = route.params;
  const [Vaccines, setVaccines] = useState([]);

  useEffect(() => {
    const loadPrescriptions = async () => {
      try {
        const presDataRef = ref(db, `users/patients/${userId}/Vaccine`);
        const snapshot = await get(presDataRef);

        if (snapshot.exists()) {
          const loadedPrescriptions = [];
          snapshot.forEach((childSnapshot) => {
            const prescriptionData = childSnapshot.val();
            prescriptionData.id = childSnapshot.key;
            loadedPrescriptions.push(prescriptionData);
          });

          if (loadedPrescriptions.length > 0) {
            setVaccines(loadedPrescriptions);
          } else {
            console.log("No prescriptions found.");
          }
        } else {
          console.log("No data found in snapshot.");
        }
      } catch (error) {
        console.error("Error loading prescriptions:", error);
      }
    };

    loadPrescriptions();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.historyHeader}>Vaccine History</Text>
      <FlatList
        data={Vaccines}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.vaccineItem}>
            <Text>
              Medical Unit: {"  "}
              {item.medicalUnitName}
            </Text>
            <Text>
              Vaccine Name: {"  "}
              {item.vaccineName}
            </Text>
            <Text>
              Date: {"  "}
              {item.formattedDate}
            </Text>
          </View>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },

  historyHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  vaccineItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
  },
});

export default Vaccines;

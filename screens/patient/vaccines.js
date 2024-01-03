import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";
import styles from "../../styles/patientStyles/vaccineStyle";

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
      {Vaccines.length > 0 ? (
        <FlatList
          data={Vaccines}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.vaccineItem}>
              <View style={styles.row}>
                <Text style={{ ...styles.bold, marginBottom: 5 }}>
                  Vaccine Name:{" "}
                </Text>
                <Text>{item.vaccineName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ ...styles.bold, marginBottom: 5 }}>
                  Medical Unit:{" "}
                </Text>
                <Text>{item.medicalUnitName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ ...styles.bold, marginBottom: 5 }}>Date: </Text>
                <Text>{item.formattedDate}</Text>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.noVaccinesContainer}>
          <Text style={styles.noVaccinesText}>You have no Vaccines yet.</Text>
        </View>
      )}
    </View>
  );
};

export default Vaccines;

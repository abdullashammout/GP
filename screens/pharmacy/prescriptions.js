import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ref, get, set, update } from "firebase/database";
import { db } from "../../firebase";
import { Ionicons } from "@expo/vector-icons";

const PharPrescription = ({ navigation, route }) => {
  const { patientId } = route.params;
  const [prescriptions, setPrescriptions] = useState([]);

  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState(null);
  const [patientGender, setPatientGender] = useState(null);
  const [pId, setPId] = useState(null);

  // Fetch patient information from the database using the patientId
  useEffect(() => {
    const userRef = ref(db, `users/patients/${patientId}`);
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          // Set the patient name to state
          const { name } = snapshot.val();
          setPatientName(name);
          const { age } = snapshot.val();
          setPatientAge(age);
          const { gender } = snapshot.val();
          setPatientGender(gender);
          const { id } = snapshot.val();
          setPId(id);
        } else {
          console.log("Patient not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching patient data: ", error);
      });
  }, [patientId]);

  const handleSellPrescription = async (id) => {
    Alert.alert("Sell Confirmation", "Are you sure you sold the prescription", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "ok",
        onPress: async () => {
          try {
            // Update the local state to mark the prescription as sold
            const updatedPrescriptions = prescriptions.map((prescription) =>
              prescription.id === id
                ? { ...prescription, isSold: !prescription.isSold }
                : prescription
            );
            setPrescriptions(updatedPrescriptions);

            // Update the database to mark the prescription as sold
            // Modify the path accordingly based on your database structure
            const presDataRef = ref(
              db,
              `users/patients/${patientId}/prescription/${id}`
            );
            await update(presDataRef, {
              isSold: !prescriptions.find((p) => p.id === id)?.isSold,
            });
          } catch (error) {
            console.error("Error selling prescription:", error);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    const loadPrescriptions = async () => {
      try {
        const presDataRef = ref(db, `users/patients/${patientId}/prescription`);
        const snapshot = await get(presDataRef);

        if (snapshot.exists()) {
          const loadedPrescriptions = [];

          snapshot.forEach((childSnapshot) => {
            const prescriptionData = {
              ...childSnapshot.val(),
              id: childSnapshot.key,
            };
            loadedPrescriptions.push(prescriptionData);
          });

          if (loadedPrescriptions.length > 0) {
            setPrescriptions(loadedPrescriptions);
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
  }, [patientId]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.itemContainer, item.isSold && styles.soldItemContainer]}
      onPress={() =>
        navigation.navigate("patientMedications", {
          itemId: item.id,
          itemName: item.createdBy,
          medicalUnitName: item.medicalUnitName,
          patientId: patientId,
        })
      }
    >
      <Text style={styles.itemHeaderText}>{`Prescription ${index + 1}`}</Text>
      <Text
        style={styles.itemText}
      >{`Medical Unit: ${item.medicalUnitName}`}</Text>
      <Text style={styles.itemText}>{`Doctor: ${item.createdBy}`}</Text>
      <Text style={styles.itemText}>{`Date: ${item.date}`}</Text>
      <Text style={styles.itemText}>{`Time: ${item.time}`}</Text>
      <TouchableOpacity
        style={styles.sell}
        onPress={() => handleSellPrescription(item.id)}
        disabled={item.isSold} // optional: disable the touchable opacity if the item is sold
      >
        <Text style={{ color: "white" }}>{item.isSold ? "Sold" : "Sell"}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{ margin: 20, marginTop: 5 }}>
        <Text style={{ textAlign: "center", fontSize: 19, fontWeight: "bold" }}>
          Patient Prescriptions
        </Text>
      </View>
      <View style={styles.patientInfoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.info}>{patientName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.info}>{patientAge}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.info}>{patientGender}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.info}>{pId}</Text>
        </View>
      </View>
      {prescriptions.length > 0 ? (
        <FlatList
          data={prescriptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatlistContainer}
        />
      ) : (
        <View style={styles.noPrescriptionsContainer}>
          <Text style={styles.noPrescriptionsText}>
            This patient have no prescriptions yet.
          </Text>
        </View>
      )}
      <Ionicons
        style={{ position: "absolute", left: 20, top: 23 }}
        name="arrow-back"
        size={24}
        color="black"
        onPress={() => {
          Alert.alert(
            "Exit Confirmation",
            "Are you sure you want to exit patient Prescription History?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Exit",
                onPress: async () => {
                  navigation.goBack();
                },
              },
            ]
          );
        }}
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
  itemContainer: {
    backgroundColor: "#3498db",
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
  },
  flatlistContainer: {
    paddingBottom: 16,
  },
  itemHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
  },
  noPrescriptionsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPrescriptionsText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
  soldItemContainer: {
    opacity: 0.7,
  },
  sell: {
    backgroundColor: "lightgreen",
    padding: 10,
    position: "absolute",
    borderRadius: 5,
    right: 25,
    top: 65,
  },
  patientInfoContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    margin: 10,
    marginVertical: 2,
    padding: 15,
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  info: {
    color: "#555",
  },
});

export default PharPrescription;

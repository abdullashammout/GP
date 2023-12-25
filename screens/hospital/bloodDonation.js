import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ref, set, get, push } from "firebase/database";
import { db } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BloodDonation = ({ navigation, route }) => {
  const { patientId } = route.params;
  const [donationType, setDonationType] = useState("");
  const [donationTypeError, setDonationTypeError] = useState(null);
  const [eligible, setEligible] = useState(null);
  const [medicalUnitName, setMedicalUnitName] = useState("");
  const [donationData, setDonationData] = useState([]);
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    try {
      const bloodDonationsRef = ref(
        db,
        `users/patients/${patientId}/BloodDonations`
      );
      const snapshot = await get(bloodDonationsRef);
      const loadedData = [];

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const itemData = childSnapshot.val();
          itemData.id = childSnapshot.key;
          loadedData.push(itemData);
        });
        setDonationData(loadedData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const getMedicalUnitName = async () => {
    const Name = await AsyncStorage.getItem("HospitalName");
    setMedicalUnitName(Name);
  };
  getMedicalUnitName();

  const addBloodDonation = async () => {
    if (donationType === "") {
      setDonationType("");
      setDonationTypeError("please enter dontaion type");
      return;
    }
    try {
      // const testDate = new Date();
      // testDate.setDate(currentDate.getDate() - 50); // Set date 60 days ago

      // const formattedTestDate = `${testDate.getDate()}/${
      //   testDate.getMonth() + 1
      // }/${testDate.getFullYear()}`;

      const newDonation = {
        formattedDate,
        medicalUnitName,
        donationType,
      };
      const donationDataRef = ref(
        db,
        `users/patients/${patientId}/BloodDonations`
      );
      const newDonationRef = push(donationDataRef, newDonation);
      const newItemId = newDonationRef.key;

      newDonation.id = newItemId;
      set(newDonationRef, newDonation);
      setDonationData((prevData) => [...prevData, newDonation]);
      setDonationType("");
      setDonationTypeError(null);
    } catch (error) {
      console.error("Error saving donation:", error);
    }
  };
  const deleteDonation = async (id) => {
    try {
      const newDonations = donationData.filter((item) => item.id !== id);

      const donationDataRef = ref(
        db,
        `users/patients/${patientId}/BloodDonations/${id}`
      );

      await set(donationDataRef, null);
      setDonationData(newDonations);
    } catch (error) {
      console.error("Error deleting donation:", error);
    }
  };
  const checkEligibility = () => {
    if (donationData.length === 0) {
      setEligible(true);
    } else {
      const lastDonation = donationData[donationData.length - 1];

      // Parse the formattedDate string to create a Date object
      const dateParts = lastDonation.formattedDate.split("/");
      const lastDonationDateObject = new Date(
        parseInt(dateParts[2], 10), // year
        parseInt(dateParts[1], 10) - 1, // month (months are 0-indexed)
        parseInt(dateParts[0], 10) // day
      );

      const timeDifference =
        currentDate.getTime() - lastDonationDateObject.getTime();

      const minimumTimeBetweenDonations = 56 * 24 * 60 * 60 * 1000;

      if (timeDifference > minimumTimeBetweenDonations) {
        setEligible(true);
      } else {
        setEligible(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.input}
          placeholder={
            donationTypeError ? donationTypeError : "Enter Dontaion Type"
          }
          placeholderTextColor={donationTypeError ? "red" : "gray"}
          value={donationType}
          onChangeText={(text) => setDonationType(text)}
        />
        <TouchableOpacity
          style={styles.checkEligibilityButton}
          onPress={addBloodDonation}
        >
          <Text style={styles.checkEligibilityButtonText}>Add Donation</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 15 }}>
        {eligible !== null && (
          <Text
            style={{
              padding: 10,
              textAlign: "center",
              backgroundColor: eligible ? "#4CAF50" : "#f44336",
              color: "#fff",
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            {eligible
              ? "The Patient is eligible to donate blood."
              : "The Patient is not eligible to donate blood yet."}
          </Text>
        )}
        <TouchableOpacity
          style={styles.checkEligibilityButton}
          onPress={checkEligibility}
        >
          <Text style={styles.checkEligibilityButtonText}>
            Check Eligibility
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.historyHeader}>Blood Donation History</Text>
      {donationData.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No Donations recorded for this patient.</Text>
        </View>
      ) : (
        <FlatList
          data={donationData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bloodDonationItem}>
              <Text style={{ fontWeight: "bold" }}>
                type: {item.donationType}
              </Text>
              <Text>Location: {item.medicalUnitName}</Text>
              <Text>Date: {item.formattedDate}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteDonation(item.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderRadius: 10,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  historyHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  bloodDonationItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#ADD8E6",
    borderRadius: 8,
  },
  deleteButton: {
    position: "absolute",
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 5,
    bottom: 5,
    right: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
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

export default BloodDonation;

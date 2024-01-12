import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import styles from "../../styles/hospitalStyles/bloodDonationStyles";
import { ref, set, get, push } from "firebase/database";
import { db } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

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
    } catch (error) {}
  };

  const getMedicalUnitName = async () => {
    const Name = await AsyncStorage.getItem("HospitalName");
    setMedicalUnitName(Name);
  };
  getMedicalUnitName();

  const addBloodDonation = async () => {
    if (donationType === "") {
      setDonationType("");
      setDonationTypeError("Please select donation type");
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
    } catch (error) {}
  };
  const deleteDonation = async (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this Blood Donation?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const newDonations = donationData.filter(
                (item) => item.id !== id
              );

              const donationDataRef = ref(
                db,
                `users/patients/${patientId}/BloodDonations/${id}`
              );

              await set(donationDataRef, null);
              setDonationData(newDonations);
            } catch (error) {}
          },
        },
      ]
    );
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
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <View>
          <Text style={{ bottom: 5, fontWeight: "700" }}>
            Blood Donation Type:{" "}
          </Text>
          <Picker
            style={styles.input}
            selectedValue={donationType}
            onValueChange={(itemValue) => setDonationType(itemValue)}
          >
            <Picker.Item label="Select Donation Type" value="" />
            <Picker.Item label="Whole Blood" value="Whole Blood" />
            <Picker.Item label="Platelets" value="Platelets" />
            <Picker.Item label="Red Blood Cells" value="Red Blood Cells" />
            <Picker.Item label="Plasma" value="Plasma" />
          </Picker>

          {donationTypeError && (
            <Text
              style={{ color: "red", marginVertical: 7, textAlign: "center" }}
            >
              {donationTypeError}
            </Text>
          )}

          {/* <TextInput
            style={styles.input}
            placeholder={
              donationTypeError ? donationTypeError : "Enter Dontaion Type"
            }
            placeholderTextColor={donationTypeError ? "red" : "gray"}
            value={donationType}
            onChangeText={(text) => setDonationType(text)}
            maxLength={20}
          /> */}
          <TouchableOpacity
            style={{ ...styles.checkEligibilityButton, marginTop: 5 }}
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
                marginTop: 10,
              }}
            >
              {eligible
                ? "The Patient is eligible to donate blood."
                : "The Patient is not eligible to donate blood yet."}
            </Text>
          )}
          <TouchableOpacity
            style={{ ...styles.checkEligibilityButton, marginTop: 10 }}
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
                  Dontaion Type:{" "}
                  <Text style={{ fontWeight: "normal" }}>
                    {item.donationType}
                  </Text>
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  Hospital Name:{" "}
                  <Text style={{ fontWeight: "normal" }}>
                    {item.medicalUnitName}
                  </Text>
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  Date:{" "}
                  <Text style={{ fontWeight: "normal" }}>
                    {item.formattedDate}
                  </Text>
                </Text>
                {item.medicalUnitName === medicalUnitName && ( // Check if created by the current medical unit
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteDonation(item.id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default BloodDonation;

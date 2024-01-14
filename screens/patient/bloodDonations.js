import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";
import styles from "../../styles/patientStyles/bloodDonationStyle";

const BloodDonations = ({ route }) => {
  const { userId } = route.params;
  const [donationData, setDonationData] = useState([]);
  const [eligible, setEligible] = useState(null);
  const currentDate = new Date();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const bloodDonationsRef = ref(
        db,
        `users/patients/${userId}/BloodDonations`
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
      <View style={styles.eligibilityContainer}>
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
              ? "You are eligible to donate blood."
              : "You are not eligible to donate blood yet."}
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
      <View style={styles.separator} />
      <Text style={styles.historyHeader}>Blood Donation History</Text>
      {donationData.length > 0 ? (
        <FlatList
          data={donationData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bloodDonationItem}>
              <View style={styles.row}>
                <Text style={{ ...styles.bold, marginBottom: 5 }}>
                  Dontaion type:{" "}
                </Text>
                <Text>{item.donationType}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ ...styles.bold, marginBottom: 5 }}>
                  Hospital name:{" "}
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
        <Text style={styles.noDonationsText}>You have no donations yet.</Text>
      )}
    </View>
  );
};

export default BloodDonations;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";

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
    } catch (error) {
      console.error("Error loading data:", error);
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
              <Text style={{ ...styles.bold, marginBottom: 5 }}>
                Type: {item.donationType}
              </Text>
              <Text style={{ marginBottom: 5 }}>
                Medical Unit: {item.medicalUnitName}
              </Text>
              <Text style={{ marginBottom: 5 }}>
                Date: {item.formattedDate}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noDonationsText}>You have no donations yet.</Text>
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
  eligibilityContainer: {
    marginTop: 15,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 16,
  },
  historyHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  bloodDonationItem: {
    marginBottom: 8,
    backgroundColor: "#aed6f1", // Adjust the background color
    borderRadius: 12,
    padding: 16,
  },
  noDonationsText: {
    textAlign: "center",
    color: "#555",
    marginTop: 20,
  },
  checkEligibilityButton: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  checkEligibilityButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  bold: {
    fontWeight: "bold",
  },
});

export default BloodDonations;

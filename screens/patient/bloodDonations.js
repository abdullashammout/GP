import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ref, set, get, push } from "firebase/database";
import { db } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        const sortedData = loadedData.sort((a, b) => a.id.localeCompare(b.id));
        setDonationData(sortedData);
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
      <View style={{ marginTop: 15 }}>
        {eligible !== null && (
          <Text
            style={{
              padding: 10,
              textAlign: "center",
              backgroundColor: eligible ? "green" : "red",
            }}
          >
            {eligible
              ? "You are eligible to donate blood."
              : "You are not eligible to donate blood yet."}
          </Text>
        )}
        <Button title="Check Eligibility" onPress={checkEligibility} />
      </View>
      <Text style={styles.historyHeader}>
        ___________________________________________
      </Text>
      {donationData.length > 0 ? (
        <FlatList
          data={donationData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bloodDonationItem}>
              <Text> Location: {item.medicalUnitName}</Text>
              <Text> Date: {item.formattedDate}</Text>
              <Text> type: {item.donationType}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={{ textAlign: "center" }}>You Have no Donations yet.</Text>
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
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
  },
});

export default BloodDonations;

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AccountInfoScreen = ({ navigation, route }) => {
  const { userId } = route.params || {};
  const [patientEmail, setPatientEmail] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientAge, setPatientAge] = useState("");

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const userInfo = ref(db, `users/patients/${userId}`);
        const snapshot = await get(userInfo);

        if (snapshot.exists()) {
          const { email, gender, age } = snapshot.val();

          await AsyncStorage.setItem("PatientEmail", email);
          await AsyncStorage.setItem("PatientId", userId);
          await AsyncStorage.setItem("PatientGender", gender);
          await AsyncStorage.setItem("PatientAge", age.toString());
        }
      } catch (error) {
        console.error("Error fetching Patient data:", error);
      }
    };

    fetchPatientInfo();
  }, [userId]);

  const getPatientInfo = async () => {
    const pEmail = await AsyncStorage.getItem("PatientEmail");
    const pID = await AsyncStorage.getItem("PatientId");
    const pGender = await AsyncStorage.getItem("PatientGender");
    const pAge = await AsyncStorage.getItem("PatientAge");
    setPatientEmail(pEmail);
    setPatientId(pID);
    setPatientGender(pGender);
    setPatientAge(pAge);
  };

  useEffect(() => {
    getPatientInfo();
  }, []);

  return (
    <View style={styles.container}>
      <InfoContainer label="Email" value={patientEmail} />
      <InfoContainer label="ID" value={patientId} />
      <InfoContainer label="Gender" value={patientGender} />
      <InfoContainer label="Age" value={patientAge} />
    </View>
  );
};

const InfoContainer = ({ label, value }) => (
  <View style={styles.infoContainer}>
    <Text style={styles.label}>{label}:</Text>
    <View style={styles.valueContainer}>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Light background color
  },
  infoContainer: {
    marginTop: 20,
    flexDirection: "row",
    backgroundColor: "#fff", // White background for info container
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3498db", // Blue label color
  },
  valueContainer: {
    marginLeft: 20,
  },
  value: {
    fontStyle: "italic",
    fontWeight: "500",
    color: "#2c3e50", // Dark text color
  },
});

export default AccountInfoScreen;

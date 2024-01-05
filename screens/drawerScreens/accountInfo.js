import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import styles from "../../styles/drawerStyles/accountInfoStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AccountInfoScreen = ({ navigation, route }) => {
  const { userId } = route.params || {};
  const [patientEmail, setPatientEmail] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientBloodType, setPatientBloodType] = useState("");

  const getPatientInfo = async () => {
    const pEmail = await AsyncStorage.getItem("PatientEmail");
    const pID = await AsyncStorage.getItem("PatientId");
    const pGender = await AsyncStorage.getItem("PatientGender");
    const pName = await AsyncStorage.getItem("PatientName");
    const pAge = await AsyncStorage.getItem("PatientAge");
    const pBloodType = await AsyncStorage.getItem("PatientBloodType");
    setPatientEmail(pEmail);
    setPatientId(pID);
    setPatientGender(pGender);
    setPatientAge(pAge);
    setPatientName(pName);
    setPatientBloodType(pBloodType);
  };

  useEffect(() => {
    getPatientInfo();
  }, []);

  return (
    <View style={styles.container}>
      <InfoContainer label="Name" value={patientName} />
      <InfoContainer label="ID" value={patientId} />
      <InfoContainer label="Email" value={patientEmail} />
      <InfoContainer label="Blood Type" value={patientBloodType} />
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

export default AccountInfoScreen;

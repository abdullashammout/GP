import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  FlatList,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import styles from "../../styles/hospitalStyles/diagnosisStyles";
import { set, ref, push, get } from "firebase/database";
import { db } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DiagnosisList = ({ navigation, route }) => {
  const { patientId } = route.params;
  const [diagnosis, setDiagnosis] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [diagnosisName, setDiagnosisName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [medicalUnitName, setMedicalUnitName] = useState("");
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;

  const loadData = async () => {
    try {
      const AllergyDataRef = ref(db, `users/patients/${patientId}/Diagnosis`);
      const snapshot = await get(AllergyDataRef);
      const loadedData = [];

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const itemData = childSnapshot.val();
          itemData.id = childSnapshot.key;
          loadedData.push(itemData);
        });
        setDiagnosis(loadedData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, [patientId]);

  const getMedicalUnitName = async () => {
    const Name = await AsyncStorage.getItem("HospitalName");
    setMedicalUnitName(Name);
  };
  getMedicalUnitName();

  const addDiagnosis = async () => {
    if (diagnosisName && doctorName) {
      const newDiagnosis = {
        diagnosis: diagnosisName,
        date: formattedDate,
        medicalUnit: medicalUnitName,
        doctor: doctorName,
      };
      const diagnosisDataRef = ref(db, `users/patients/${patientId}/Diagnosis`);
      const newDiagnosisRef = push(diagnosisDataRef, newDiagnosis);

      const newItemId = newDiagnosisRef.key;
      newDiagnosis.id = newItemId;
      await set(newDiagnosisRef, newDiagnosis);
      setDiagnosis((prevData) => [...prevData, newDiagnosis]);

      setDiagnosisName("");
      setDoctorName("");
      toggleModal();
    }
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setDoctorName("");
    setDiagnosisName("");
  };

  const deleteDiagnosis = async (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this Diagnosis?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const newDiagnosis = diagnosis.filter((item) => item.id !== id);

              const DiagnosisDataRef = ref(
                db,
                `users/patients/${patientId}/Diagnosis/${id}`
              );
              await set(DiagnosisDataRef, null);
              setDiagnosis(newDiagnosis);
            } catch (error) {
              console.error("Error deleting item:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Modal visible={isModalVisible} animationType="fade" transparent={true}>
        <TouchableWithoutFeedback
          onPressOut={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Add Diagnosis</Text>

              <TextInput
                style={styles.input}
                placeholder="Doctor Name"
                value={doctorName}
                onChangeText={(text) => setDoctorName(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Diagnosis"
                value={diagnosisName}
                onChangeText={(text) => setDiagnosisName(text)}
                multiline
              />

              <View style={{ flexDirection: "row", alignSelf: "center" }}>
                <TouchableOpacity style={styles.btns} onPress={addDiagnosis}>
                  <Text style={{ color: "#fff" }}>Add</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btns} onPress={toggleModal}>
                  <Text style={{ color: "#fff" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {diagnosis.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No diagnosis recorded for this patient.</Text>
        </View>
      ) : (
        <FlatList
          data={diagnosis}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.diagnosisItem}>
              <Text style={styles.bold}>
                Diagnosis:{" "}
                <Text style={{ fontWeight: "normal" }}>{item.diagnosis}</Text>
              </Text>
              <Text style={styles.bold}>
                Hospital:{" "}
                <Text style={{ fontWeight: "normal" }}>{item.medicalUnit}</Text>
              </Text>
              <Text style={styles.bold}>
                Doctor:{" "}
                <Text style={{ fontWeight: "normal" }}>{item.doctor}</Text>
              </Text>
              <Text style={styles.bold}>
                Date: <Text style={{ fontWeight: "normal" }}>{item.date}</Text>
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteDiagnosis(item.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <TouchableOpacity
        style={{ ...styles.btns, paddingVertical: 12, marginLeft: 1 }}
        onPress={toggleModal}
      >
        <Text style={{ ...styles.buttonText, fontSize: 16 }}>
          Add diagnosis
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DiagnosisList;

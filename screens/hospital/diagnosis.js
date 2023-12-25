import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
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

      <FlatList
        data={diagnosis}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.diagnosisItem}>
            <Text style={styles.bold}>Diagnosis: {item.diagnosis}</Text>
            <Text>Hospital: {item.medicalUnit}</Text>
            <Text>Doctor: {item.doctor}</Text>
            <Text>Date:{item.date}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteDiagnosis(item.id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        style={{ ...styles.btns, paddingVertical: 12 }}
        onPress={toggleModal}
      >
        <Text style={{ ...styles.buttonText, fontSize: 16 }}>
          Add diagnosis
        </Text>
      </TouchableOpacity>
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
    borderColor: "#3498db",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#2c3e50",
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  diagnosisItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#ADD8E6",
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  bold: {
    fontWeight: "bold",
  },
  deleteButton: {
    position: "absolute",
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 5,
    bottom: 15,
    right: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  btns: {
    marginLeft: 17,
    top: 5,
    backgroundColor: "#3498db",
    bottom: 20,
    padding: 15,
    borderRadius: 10,
    margin: 5,
  },
});

export default DiagnosisList;

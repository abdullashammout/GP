import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import styles from "../../../styles/hospitalStyles/presStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set, ref, get, push } from "firebase/database";
import { db } from "../../../firebase";
import PresList from "./presList";

const Prescription = ({ navigation, route }) => {
  const { patientId } = route.params;
  const [userName, setUserName] = useState("");
  const [medicalUnitName, setMedicalUnitName] = useState("");
  const [diagnosis, setDiagnosis] = useState(``);
  const [diagnosisError, setDiagnosisError] = useState(null);
  const [userNameError, setUserNameError] = useState(null);
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const presDataRef = ref(db, `users/patients/${patientId}/prescription`);
        const snapshot = await get(presDataRef);
        const loadedData = [];

        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const itemData = childSnapshot.val();
            itemData.id = childSnapshot.key;
            loadedData.push(itemData);
          });

          setData(loadedData);
        }
      } catch (error) {}
    };

    loadData();
  }, [patientId]);

  const getMedicalUnitName = async () => {
    const Name = await AsyncStorage.getItem("HospitalName");
    setMedicalUnitName(Name);
  };
  getMedicalUnitName();

  // delete item to the patient record
  const handleDeleteItem = async (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this Prescription?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const newData = data.filter((item) => item.id !== id);

              const presDataRef = ref(
                db,
                `users/patients/${patientId}/prescription/${id}`
              );
              await set(presDataRef, null);
              setData(newData);
            } catch (error) {}
          },
        },
      ]
    );
  };
  // add item to the patient record
  const handleAddItem = async () => {
    if (userName === "" || diagnosis === "") {
      setUserNameError(" Required  ");
      setDiagnosisError("Required");
      return;
    }
    if (userName.length < 6) {
      setUserName("");
      setUserNameError("Minimum length 6 letters.");
      return;
    }
    if (diagnosis.length < 6) {
      setDiagnosis("");
      setDiagnosisError("Minimum length 6 letters.");
      return;
    }
    if (!/^[a-zA-Z\s]*$/.test(userName)) {
      setUserName("");
      setUserNameError("only letters allowed.");
      return;
    }
    if (!/^[a-zA-Z 0-9]+$/.test(diagnosis)) {
      setDiagnosis("");
      setDiagnosisError("only letters and numbers allowed.");
      return;
    }
    try {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}/${
        currentDate.getMonth() + 1
      }/${currentDate.getFullYear()}`;
      const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

      const newItemData = {
        medicalUnitName: medicalUnitName,
        date: formattedDate,
        time: formattedTime,
        createdBy: userName,
        diagnosis: diagnosis,
      };

      const presDataRef = ref(db, `users/patients/${patientId}/prescription`);

      const newPrescriptionRef = push(presDataRef, newItemData);

      const newItemId = newPrescriptionRef.key;
      newItemData.id = newItemId;

      set(newPrescriptionRef, newItemData);
      setData((prevData) => [...prevData, newItemData]);
      navigation.navigate("presList", {
        itemId: newItemId,
        CreatedBy: userName,
        Diagnosis: diagnosis,
        currentMedicalUnit: medicalUnitName,
        patientId: patientId,
      });

      setDiagnosis(``);
      setUserName("");
      setMedicalUnitName("");
      setUserNameError(null);
      setDiagnosisError(null);

      setModalVisible(false);
    } catch (error) {}
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate("presList", {
          itemId: item.id,
          CreatedBy: item.createdBy,
          Diagnosis: item.diagnosis,
          currentMedicalUnit: item.medicalUnitName,
          patientId: patientId,
        })
      }
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemText}>Prescription {index + 1}</Text>
        <Text style={styles.dateText}>
          Hospital name: {item.medicalUnitName}
        </Text>
        <Text style={styles.dateText}>Date: {item.date}</Text>
        <Text style={styles.dateText}>Time: {item.time}</Text>
        {item.medicalUnitName === medicalUnitName && ( // Check if created by the current medical unit
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleDeleteItem(item.id)}
            >
              <Text style={{ color: "white" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {data.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No Prescriptions recorded for this patient.</Text>
        </View>
      ) : (
        <View style={{ marginBottom: 50 }}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableWithoutFeedback
          onPressOut={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>Enter Doctor Name:</Text>
              <TextInput
                style={styles.input}
                placeholder={
                  userNameError ? userNameError : "First Name & Last Name"
                }
                placeholderTextColor={userNameError ? "red" : "gray"}
                value={userName}
                onChangeText={(text) => setUserName(text)}
                maxLength={25}
              />
              <Text>Diagnosis:</Text>
              <TextInput
                style={styles.input}
                value={diagnosis}
                multiline
                maxLength={80}
                numberOfLines={3}
                onChangeText={(text) => setDiagnosis(text)}
                placeholder={
                  diagnosisError
                    ? diagnosisError
                    : "             Diagnosis           "
                }
                placeholderTextColor={diagnosisError ? "red" : "gray"}
              />
              <View>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{
                      ...styles.button,
                      marginRight: 20,
                      paddingHorizontal: 20,
                      backgroundColor: "#3498db",
                    }}
                    onPress={handleAddItem}
                  >
                    <Text style={{ color: "white" }}>Add</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      ...styles.button,
                      backgroundColor: "#3498db",
                    }}
                    onPress={() => {
                      setModalVisible(false);
                      setUserName("");
                      setDiagnosis("");
                      setDiagnosisError(null);
                      setUserNameError(null);
                    }}
                  >
                    <Text style={{ color: "white" }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <TouchableOpacity
        style={styles.addItem}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          Add new Prescription
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Prescription;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import styles from "../../../styles/hospitalStyles/hospitalStayStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set, ref, get, push } from "firebase/database";
import { db } from "../../../firebase";

export default function HospitalStay({ navigation, route }) {
  const { patientId } = route.params;
  const [doctorName, setDoctorName] = useState("");
  const [doctorNameError, setDoctorNameError] = useState();
  const [medicalUnitName, setMedicalUnitName] = useState("");
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisibile] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stayDataRef = ref(db, `users/patients/${patientId}/HospitalStay`);
        const snapshot = await get(stayDataRef);
        const loadedData = [];

        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const itemData = childSnapshot.val();
            itemData.id = childSnapshot.key;
            loadedData.push(itemData);
          });

          setData(loadedData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [patientId]);

  const getMedicalUnitName = async () => {
    const Name = await AsyncStorage.getItem("HospitalName");
    setMedicalUnitName(Name);
  };
  getMedicalUnitName();

  const handleDeleteItem = async (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this Hospital Entry?",
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

              const stayDataRef = ref(
                db,
                `users/patients/${patientId}/HospitalStay/${id}`
              );
              await set(stayDataRef, null);
              setData(newData);
            } catch (error) {
              console.error("Error deleting item:", error);
            }
          },
        },
      ]
    );
  };
  const handleAddItem = async () => {
    if (doctorName === "") {
      setDoctorNameError("Required");
      return;
    }
    if (doctorName.length < 6) {
      setDoctorName("");
      setDoctorNameError("Minimum length 6 letters.");
      return;
    } else {
      setDoctorNameError(null);
    }
    if (!/^[a-zA-Z\s]*$/.test(doctorName)) {
      setDoctorName("");
      setDoctorNameError("only letters allowed.");
      return;
    }
    try {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}/${
        currentDate.getMonth() + 1
      }/${currentDate.getFullYear()}`;
      const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

      const newItemData = {
        createdBy: doctorName,
        medicalUnitName: medicalUnitName,
        date: formattedDate,
        time: formattedTime,
      };

      const stayDataRef = ref(db, `users/patients/${patientId}/HospitalStay`);

      const newHospitalStayRef = push(stayDataRef, newItemData);

      const newItemId = newHospitalStayRef.key;
      newItemData.id = newItemId;

      set(newHospitalStayRef, newItemData);
      setData((prevData) => [...prevData, newItemData]);
      navigation.navigate("StayList", {
        itemId: newItemId,
        patientId: patientId,
        currentMedicalUnit: medicalUnitName,
      });

      setDoctorNameError(null);
      setDoctorName("");
      setModalVisibile(false);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        navigation.navigate("StayList", {
          itemId: item.id,
          patientId: patientId,
          currentMedicalUnit: item.medicalUnitName,
        });
      }}
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemText}>hospital admission {index + 1}</Text>
        <Text style={styles.dateText}>
          Hospital Name: {item.medicalUnitName}
        </Text>
        <Text style={styles.dateText}>Doctor Name: {item.createdBy}</Text>
        <Text style={styles.dateText}>entry date: {item.date}</Text>
        <Text style={styles.dateText}>entry time: {item.time}</Text>
        {item.medicalUnitName === medicalUnitName && ( // Check if created by the current medical unit
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleDeleteItem(item.id)}
          >
            <Text style={{ color: "white" }}>Delete</Text>
          </TouchableOpacity>
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
          <Text>No hospital entries recorded for this patient.</Text>
        </View>
      ) : (
        <View style={{ marginBottom: 50 }}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisibile(!modalVisible);
        }}
      >
        <TouchableWithoutFeedback
          onPressOut={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{ padding: 10 }}>Enter Doctor Name</Text>
              <TextInput
                style={styles.input}
                placeholder={
                  doctorNameError ? doctorNameError : "First Name & Last Name"
                }
                placeholderTextColor={doctorNameError ? "red" : "gray"}
                value={doctorName}
                onChangeText={(text) => setDoctorName(text)}
                maxLength={22}
              />
              <View style={{ flexDirection: "row", alignSelf: "center" }}>
                <TouchableOpacity
                  style={{ ...styles.btns, paddingHorizontal: 26 }}
                  onPress={handleAddItem}
                >
                  <Text style={{ color: "#fff" }}>Add</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btns}
                  onPress={() => {
                    setModalVisibile(false);
                    setDoctorName("");
                    setDoctorNameError(null);
                  }}
                >
                  <Text style={{ color: "#fff" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <TouchableOpacity
        style={styles.addItem}
        onPress={() => setModalVisibile(true)}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          add new Hospital Entry
        </Text>
      </TouchableOpacity>
    </View>
  );
}

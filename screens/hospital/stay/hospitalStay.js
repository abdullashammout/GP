import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Button,
  TextInput,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set, ref, get, push } from "firebase/database";
import { db } from "../../../firebase";

export default function HospitalStay({ navigation, route }) {
  const { patientId } = route.params;
  const [doctorName, setDoctorName] = useState("");
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
  }, [patientId, data]);

  const getMedicalUnitName = async () => {
    const Name = await AsyncStorage.getItem("HospitalName");
    setMedicalUnitName(Name);
  };
  getMedicalUnitName();

  const handleDeleteItem = async (id) => {
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
  };

  const handleAddItem = async () => {
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

      setDoctorName("");
      setModalVisibile(false);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <Text style={{ fontWeight: "bold" }}>hospital admission {index + 1}</Text>
      <Text>hospital name: {item.medicalUnitName}</Text>
      <Text>Doctor name:{item.createdBy}</Text>
      <Text>entry date:{item.date}</Text>
      <Text>entry time:{item.time}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleDeleteItem(item.id)}
      >
        <Text style={{ color: "white" }}>Delete</Text>
      </TouchableOpacity>
    </View>
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
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
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
              <Text>enter doctor name</Text>
              <TextInput
                style={styles.input}
                placeholder="your name"
                value={doctorName}
                onChangeText={(text) => setDoctorName(text)}
              />
              <View style={{ flexDirection: "row", alignSelf: "center" }}>
                <TouchableOpacity style={styles.btns} onPress={handleAddItem}>
                  <Text style={{ color: "#fff" }}>Add</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btns}
                  onPress={() => {
                    setModalVisibile(false);
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
        <Text style={{ color: "white" }}>add new Hospital Entry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  itemContainer: {
    backgroundColor: "#ADD8E6",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    backgroundColor: "#e74c3c",
    padding: 10,
    marginLeft: 5, // Add some space between buttons
    borderRadius: 5,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  addItem: {
    backgroundColor: "#3498db",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    padding: 10,
    paddingHorizontal: 90,
    borderRadius: 10,
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

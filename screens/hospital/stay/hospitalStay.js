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
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        navigation.navigate("StayList", {
          itemId: item.id,
          patientId: patientId,
        });
      }}
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemText}>hospital admission {index + 1}</Text>
        <Text style={styles.dateText}>
          hospital name: {item.medicalUnitName}
        </Text>
        <Text style={styles.dateText}>Doctor name:{item.createdBy}</Text>
        <Text style={styles.dateText}>entry date:{item.date}</Text>
        <Text style={styles.dateText}>entry time:{item.time}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleDeleteItem(item.id)}
        >
          <Text style={{ color: "white" }}>Delete</Text>
        </TouchableOpacity>
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
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          add new Hospital Entry
        </Text>
      </TouchableOpacity>
    </View>
  );
}

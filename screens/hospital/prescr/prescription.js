import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set, ref, get, push } from "firebase/database";
import { db } from "../../../firebase";

const Prescription = ({ navigation, route }) => {
  const { patientId } = route.params;
  const [userName, setUserName] = useState("");
  const [medicalUnitName, setMedicalUnitName] = useState("");
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
          const sortedData = loadedData.sort((a, b) =>
            a.id.localeCompare(b.id)
          );
          setData(sortedData);
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

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate("presList", {
          idd: index + 1,
          itemId: item.id,
          itemName: item.createdBy,
          medicalUnitName: item.medicalUnitName,
          patientId: patientId,
        })
      }
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemText}>Prescription {index + 1}</Text>
        <Text>Doctor name: {item.createdBy}</Text>
        <Text style={styles.dateText}>Date: {item.date}</Text>
        <Text style={styles.dateText}>Time: {item.time}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteItem(item.id)}
      >
        <Text style={{ color: "white" }}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handleDeleteItem = async (id) => {
    try {
      const newData = data.filter((item) => item.id !== id);

      const presDataRef = ref(
        db,
        `users/patients/${patientId}/prescription/${id}`
      );
      await set(presDataRef, null);
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
        createdBy: userName,
        medicalUnitName: medicalUnitName,
        date: formattedDate,
        time: formattedTime,
      };

      const presDataRef = ref(db, `users/patients/${patientId}/prescription`);

      const newPrescriptionRef = push(presDataRef, newItemData);

      const newItemId = newPrescriptionRef.key;
      newItemData.id = newItemId;

      set(newPrescriptionRef, newItemData);
      setData((prevData) => [...prevData, newItemData]);

      setUserName("");
      setMedicalUnitName("");
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
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
            setModalVisible(false);
            setUserName("");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>Enter doctor name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your name"
                value={userName}
                onChangeText={(text) => setUserName(text)}
              />
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={handleAddItem}>
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Button title="Add new item" onPress={() => setModalVisible(true)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ADD8E6",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  itemInfo: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dateText: {
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "white",
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
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 8,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
});

export default Prescription;

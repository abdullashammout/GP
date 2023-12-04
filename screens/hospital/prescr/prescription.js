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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set, child, ref, get } from "firebase/database";
import { db } from "../../../firebase";

const Prescription = ({ navigation, route }) => {
  const { patientId } = route.params;
  const [nextId, setNextId] = useState(1);
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
            loadedData.push(itemData);
            setNextId(loadedData.length + 1); // Set nextId based on the length
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

  const renderItem = ({ item, index = 0 }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate("presList", {
          itemId: index + 1,
          itemName: item.createdBy,
          medicalUnitName: item.medicalUnitName,
          patientId: patientId,
        })
      }
    >
      <View>
        <Text style={styles.itemText}>Prescription {index + 1}</Text>
        <Text>Doctor name: {item.createdBy}</Text>
        <Text
          style={{
            position: "absolute",
            alignSelf: "flex-end",
            marginTop: 10,
          }}
        >
          Date: {item.date}
        </Text>
        <Text
          style={{
            position: "absolute",
            alignSelf: "flex-end",
            marginTop: 30,
          }}
        >
          Time: {item.time}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleAddItem = async () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${
      currentDate.getMonth() + 1
    }/${currentDate.getFullYear()}`;
    const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

    const newItemData = {
      // ide: nextId.toString(),
      createdBy: userName,
      medicalUnitName: medicalUnitName,
      date: formattedDate,
      time: formattedTime,
    };

    const presDataRef = ref(db, `users/patients/${patientId}/prescription`);

    const newPrescriptionRef = child(presDataRef, nextId.toString());

    set(newPrescriptionRef, newItemData);

    setData((prevData) => [...prevData, newItemData]);
    setNextId((prevId) => prevId + 1);

    setUserName("");
    setMedicalUnitName("");
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
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
            <Button title="Add" onPress={handleAddItem} />
            <Button
              title="Cancel"
              onPress={() => {
                setModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>
      <Button title="Add new item" onPress={() => setModalVisible(true)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
});

export default Prescription;

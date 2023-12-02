import React, { useState } from "react";
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

const Prescription = ({ navigation }) => {
  const [newItem, setNewItem] = useState("");
  const [userName, setUserName] = useState("");
  const [medName, setMedName] = useState("");
  const [data, setData] = useState([
    { id: "1", title: "prescription 1", createdBy: "sara", medName: "panadol" },
  ]);
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate("presList", {
          itemId: item.id,
          itemName: item.createdBy,
          medName: item.medName,
        })
      }
    >
      <View>
        <Text style={styles.itemText}>Prescription {item.id}</Text>
        <Text>Doctor name: {item.createdBy}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleAddItem = () => {
    setData((prevData) => [
      ...prevData,
      {
        id: Math.random().toString(),
        title: newItem,
        createdBy: userName,
        medName: medName,
      },
    ]);
    setNewItem("");
    setUserName("");
    setMedName("");
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Modal
        animationType="slide"
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
            <Text>Enter medicine name</Text>
            <TextInput
              style={styles.input}
              placeholder="Med"
              value={medName}
              onChangeText={(text) => setMedName(text)}
            />
            <Button title="Add" onPress={handleAddItem} />
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

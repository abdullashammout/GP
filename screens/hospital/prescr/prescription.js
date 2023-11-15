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
  const [modalVisible, setModalVisibile] = useState(false);
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
        <Text>Doctor name:{item.createdBy}</Text>
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
    setModalVisibile(false);
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
          setModalVisibile(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* <TextInput style={styles.input} placeholder=' new item' value='enter doctor name' onChangeText={text => setNewItem(text)}/> */}
            <Text onChangeText={(text) => setNewItem(text)}>
              enter doctor name
            </Text>
            <TextInput
              style={styles.input}
              placeholder="your name"
              value={userName}
              onChangeText={(text) => setUserName(text)}
            />
            <Text onChangeText={(text) => setMedicineName(text)}>
              enter medicine name
            </Text>
            <TextInput
              style={styles.input}
              placeholder="med"
              value={medName}
              onChangeText={(text) => setMedName(text)}
            />
            <Button title="Add" onPress={handleAddItem} />
          </View>
        </View>
      </Modal>
      <Button title="add new item" onPress={() => setModalVisibile(true)} />
    </View>
  );
};

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
});

export default Prescription;

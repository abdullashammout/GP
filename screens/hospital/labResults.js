import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set, ref, get, push } from "firebase/database";
import { db } from "../../firebase";
import * as DocumentPicker from "expo-document-picker";

const Lab = ({ navigation, route }) => {
  const { patientId } = route.params;
  const [medicalUnitName, setMedicalUnitName] = useState("");
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const labDataRef = ref(db, `users/patients/${patientId}/labResults`);
        const snapshot = await get(labDataRef);
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
    const name = await AsyncStorage.getItem("HospitalName");
    setMedicalUnitName(name);
  };

  const handleDeleteItem = async (id) => {
    try {
      const newData = data.filter((item) => item.id !== id);

      const labDataRef = ref(
        db,
        `users/patients/${patientId}/labResults/${id}`
      );
      await set(labDataRef, null);
      setData(newData);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleAddItem = async () => {
    if (!pdfUri) {
      // Check if PDF is selected
      alert("Please select a PDF file.");
      return;
    }

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
        pdfUri: pdfUri,
      };

      const labDataRef = ref(db, `users/patients/${patientId}/labResults`);

      const newLabResultRef = push(labDataRef, newItemData);

      const newItemId = newLabResultRef.key;
      newItemData.id = newItemId;

      set(newLabResultRef, newItemData);
      setData((prevData) => [...prevData, newItemData]);

      setUserName("");
      setMedicalUnitName("");
      setPdfUri(null);
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const pickPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (result.type === "success") {
        const selectedDocument = result.assets[0];

        if (selectedDocument) {
          const { uri, name } = selectedDocument;
          setPdfUri(uri);
          console.log(`Selected PDF - Name: ${name}, URI: ${uri}`);
        } else {
          console.log("No document selected");
        }
      } else if (result.type === "cancel") {
        console.log("Document picking canceled by the user.");
      } else {
        console.log("Document picking failed with result:", result);
        alert(`Document picking failed. Reason: ${result.reason || "Unknown"}`);
      }
    } catch (error) {
      console.error("Error picking document:", error);
      alert(
        `An unexpected error occurred: ${error.message || "Unknown error"}`
      );
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate("LabResultDetail", {
          itemId: item.id,
          itemName: item.createdBy,
          medicalUnitName: item.medicalUnitName,
          patientId: patientId,
          pdfUri: item.pdfUri,
        })
      }
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemText}>Lab Result {index + 1}</Text>
        <Text style={styles.dateText}>Hospital: {item.medicalUnitName}</Text>
        <Text style={styles.dateText}>result: {item.pdfUri}</Text>
        <Text style={styles.dateText}>Date: {item.date}</Text>
        <Text style={styles.dateText}>Time: {item.time}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleDeleteItem(item.id)}
          >
            <Text style={{ color: "white" }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {data.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No Lab Results recorded for this patient.</Text>
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

      <TouchableOpacity style={styles.addItem} onPress={pickPDF}>
        <Text style={{ color: "white" }}>Add new Lab Result</Text>
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
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#3498db",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  itemInfo: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  dateText: {
    marginTop: 5,
    color: "white",
  },
  button: {
    alignSelf: "flex-end",
    backgroundColor: "#e74c3c",
    padding: 10,
    marginTop: 38,
    borderRadius: 5,
  },
  buttonContainer: {
    position: "absolute",
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
    padding: 45,
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
  input: {
    marginBottom: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 40,
    paddingVertical: 8,
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1,
  },
});

export default Lab;

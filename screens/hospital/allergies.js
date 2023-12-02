import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const PatientAllergiesPage = ({ allergies: initialAllergies = [] }) => {
  const [allergies, setAllergies] = useState(initialAllergies);
  const [newAllergy, setNewAllergy] = useState("");
  const [newHospital, setNewHospital] = useState("");
  const [newDate, setNewDate] = useState("");

  const addAllergy = () => {
    if (
      newAllergy.trim() !== "" &&
      newHospital.trim() !== "" &&
      newDate.trim() !== ""
    ) {
      setAllergies([
        ...allergies,
        { name: newAllergy, hospital: newHospital, date: newDate },
      ]);
      setNewAllergy("");
      setNewHospital("");
      setNewDate("");
    }
  };

  const deleteAllergy = (index) => {
    const updatedAllergies = [...allergies];
    updatedAllergies.splice(index, 1);
    setAllergies(updatedAllergies);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Patient Allergies</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter new allergy"
          value={newAllergy}
          onChangeText={(text) => setNewAllergy(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter hospital name"
          value={newHospital}
          onChangeText={(text) => setNewHospital(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter date"
          value={newDate}
          onChangeText={(text) => setNewDate(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addAllergy}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      {allergies.length === 0 ? (
        <Text>No allergies recorded for this patient.</Text>
      ) : (
        <FlatList
          data={allergies}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.allergyItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Name:</Text>
                <Text>{item.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Hospital:</Text>
                <Text>{item.hospital}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Date:</Text>
                <Text>{item.date}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteAllergy(index)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  allergyItem: {
    flexDirection: "row", // Display items in a column
    justifyContent: "space-between",
    alignItems: "flex-start", // Align items to the start of the container
    padding: 10,

    backgroundColor: "#ADD8E6",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    marginRight: 5,
  },

  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    paddingLeft: 10,
  },
  addButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    padding: 5, // Adjust the padding to make the button fit better
    borderRadius: 5,
    marginLeft: 2,
    alignSelf: "center", // Align the button vertically in the center
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  allergyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  inputContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
});

export default PatientAllergiesPage;

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
} from "react-native";

const PresList = ({ route }) => {
  const { itemId, itemName } = route.params;

  const [medications, setMedications] = useState([]);
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");

  const handleAddMedication = () => {
    if (medication && dosage) {
      setMedications((prevMedications) => [
        ...prevMedications,
        { medication, dosage },
      ]);
      setMedication("");
      setDosage("");
    }
  };

  const renderMedicationItem = ({ item }) => (
    <View style={styles.medicationItem}>
      <Text style={styles.label}>Medication:</Text>
      <Text style={[styles.value, styles.medication]}>{item.medication}</Text>
      <Text style={styles.label}>Dosage:</Text>
      <Text style={styles.value}>{item.dosage}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Prescription Report</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Prescription ID:</Text>
        <Text style={styles.value}>{itemId}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Doctor Name:</Text>
        <Text style={styles.value}>{itemName}</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Medication:</Text>
        <TextInput
          style={styles.input}
          value={medication}
          onChangeText={(text) => setMedication(text)}
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Dosage:</Text>
        <TextInput
          style={styles.input}
          value={dosage}
          onChangeText={(text) => setDosage(text)}
        />
      </View>

      <Button title="Add Medication" onPress={handleAddMedication} />

      <FlatList
        data={medications}
        renderItem={renderMedicationItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  formContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  medicationItem: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#555",
  },
  medication: {
    fontStyle: "italic",
    color: "#777",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginLeft: 10,
    padding: 5,
    borderRadius: 8,
  },
});

export default PresList;

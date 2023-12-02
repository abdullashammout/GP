import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";

const Vaccine = () => {
  const [vaccines, setVaccines] = useState([]);
  const [vaccineName, setVaccineName] = useState("");
  const [vaccineDate, setVaccineDate] = useState("");

  const addVaccine = () => {
    if (vaccineName && vaccineDate) {
      setVaccines([...vaccines, { name: vaccineName, date: vaccineDate }]);
      setVaccineName("");
      setVaccineDate("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Vaccine Tracker</Text>

      <TextInput
        style={styles.input}
        placeholder="Vaccine Name"
        value={vaccineName}
        onChangeText={(text) => setVaccineName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Vaccination Date (MM/DD/YYYY)"
        value={vaccineDate}
        onChangeText={(text) => setVaccineDate(text)}
      />
      <Button title="Add Vaccine" onPress={addVaccine} />

      <Text style={styles.historyHeader}>Vaccine History</Text>
      <FlatList
        data={vaccines}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.vaccineItem}>
            <Text>Vaccine: {item.name}</Text>
            <Text>Date: {item.date}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  historyHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  vaccineItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#ADD8E6",
    borderRadius: 8,
  },
});

export default Vaccine;

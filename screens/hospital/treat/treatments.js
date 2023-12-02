import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const TreatmentList = ({ navigation }) => {
  const [treatments, setTreatments] = useState([]);
  const [treatmentName, setTreatmentName] = useState("");

  const addTreatment = () => {
    if (treatmentName) {
      setTreatments([...treatments, { name: treatmentName }]);
      setTreatmentName("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Treatment List</Text>

      <TextInput
        style={styles.input}
        placeholder="Treatment Name"
        value={treatmentName}
        onChangeText={(text) => setTreatmentName(text)}
      />
      <Button title="Add Treatment" onPress={addTreatment} />

      <Text style={styles.listHeader}>Treatments</Text>
      <FlatList
        data={treatments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.treatmentItem}
            onPress={() =>
              navigation.navigate("TreatmentDetails", { treatment: item })
            }
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
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
  listHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  treatmentItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#ffffff",
    borderRadius: 8,
  },
});

export default TreatmentList;

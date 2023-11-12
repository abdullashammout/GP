import { View, Text, TextInput, StyleSheet } from "react-native";
import react, { useState } from "react";

export default function SearchPh() {
  const [id, setId] = useState("");

  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontWeight: "bold" }}>
        Enter patient ID to view his prescription
      </Text>
      <TextInput
        returnKeyType="next"
        autoCapitalize="none"
        style={styles.input}
        placeholder="Enter Patient ID"
        onChangeText={(text) => setId(text)}
        maxLength={10}
        keyboardType="numeric"
      />
    </View>
  );
}
const styles = StyleSheet.create({
  input: {
    marginTop: 20,
    padding: 10,
    height: 60,
    width: 350,
    borderRadius: 10,
    borderColor: "#f0f0f0",
    borderWidth: 2,
  },
});

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import react, { useState } from "react";

export default function SearchPh() {
  const [id, setId] = useState("");

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "bold" }}>
          Enter patient ID to view his lab results
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Patient ID"
          onChangeText={(text) => setId(text)}
          maxLength={10}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.searchBtn}>
          <Text style={styles.btnText}>Search</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
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
  searchBtn: {
    marginTop: 50,
    width: 280,
    borderColor: "white",
    padding: 10,
    backgroundColor: "black",
    borderWidth: 1,
    borderRadius: 10,
  },
  btnText: {
    color: "white",
    textAlign: "center",
  },
});

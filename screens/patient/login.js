import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import Checkbox from "expo-checkbox";
import styles from "../../styles/patientStyles/loginStyle";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";

const LoginForm = ({ navigation }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setChecked] = useState(false);

  const signIn = async () => {
    if (id === "") {
      Alert.alert("Login Failed", "ID field is required");

      return;
    }
    if (password === "") {
      Alert.alert("Login Failed", "Password field is required");
      return;
    }

    try {
      const idQuery = ref(db, "users");
      const idSnapshot = await get(idQuery);

      if (idSnapshot.exists()) {
        const idData = idSnapshot.val();

        if (idData && idData[id] && idData[id].email) {
          const email = idData[id].email;

          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
            const user = userCredential.user;

            navigation.navigate("pharmacy");
          } catch (error) {
            Alert.alert("Login Failed", "Invalid ID or Password");
          }
        } else {
          Alert.alert("Login Failed", "Invalid ID or Password");
        }
      } else {
        alert("User not found");
      }
    } catch (error) {
      console.error("Error signing in:", error);

      if (error.code === "auth/user-not-found") {
        alert("User not found. Please check your ID.");
      } else {
        // Handle other errors with a generic message
        alert("An error occurred during sign-in. Please try again later.");
      }
    }
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <View>
          <Text style={{ fontSize: 16, marginBottom: 5, marginTop: 150 }}>
            ID Number:
          </Text>
          <TextInput
            returnKeyType="next"
            autoCapitalize="none"
            style={styles.input}
            placeholder="Enter your ID"
            value={id}
            onChangeText={(text) => setId(text)}
            maxLength={10}
            keyboardType="numeric"
          />
        </View>
        <View>
          <Text style={{ fontSize: 16, marginBottom: 5 }}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={true}
            autoCapitalize="none"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <View style={styles.underInput}>
          <View style={styles.CheckRemember}>
            <Checkbox
              style={styles.checkbox}
              value={isChecked}
              onValueChange={setChecked}
              color="black"
            />

            <Text style={{ top: 10, right: 5 }}>Remember Me</Text>
          </View>
          <TouchableOpacity style={styles.forgetPass}>
            <Text style={{ color: "blue", top: 10, left: 10 }}>
              forget password?
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={signIn}>
          <Text style={{ textAlign: "center", color: "white" }}>Login</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginForm;

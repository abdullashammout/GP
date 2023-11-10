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
import { Colors } from "react-native/Libraries/NewAppScreen";

const LoginForm = ({ navigation }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [idError, setIdError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const signIn = async () => {
    if (id === "" || password === "") {
      setIdError("This Field Is Required");
      setPasswordError("This Field Is Required");
      return;
    } else {
      setIdError(null);
      setPasswordError(null);
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
            console.log(error.code);
            Alert.alert("Login Failed", "Invalid ID or Password");
          }
        } else {
          Alert.alert("Login Failed", "Invalid ID or Password");
        }
      } else {
        Alert.alert("User Not Found", "invalid ID");
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
            placeholder={idError ? idError : "Enter your ID"}
            placeholderTextColor={idError ? "red" : "gray"}
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
            placeholder={passwordError ? passwordError : "Enter your password"}
            placeholderTextColor={passwordError ? "red" : "gray"}
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

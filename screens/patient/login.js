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
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      const patientQuery = ref(db, "users/patients");
      const patientSnapshot = await get(patientQuery);

      if (patientSnapshot.exists()) {
        const patientData = patientSnapshot.val();

        // Check if the user ID exists in the patients node
        if (patientData && patientData[id] && patientData[id].email) {
          const email = patientData[id].email;
          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
            const user = userCredential.user;

            // Navigate to the patient page
            navigation.navigate("patientPage");
            return;
          } catch (error) {
            console.log(error.code);
            setIsLoading(false);
            setId("");
            setPassword("");
            setIdError("Invalid ID or Password");
            setPasswordError("Invalid ID or Password");
          }
        }
      }
      const hospitalQuery = ref(db, "users/medical_units/hospital");
      const hospitalSnapshot = await get(hospitalQuery);

      if (hospitalSnapshot.exists()) {
        const hospitalData = hospitalSnapshot.val();

        // Check if the user ID exists in the hospital node
        if (hospitalData && hospitalData[id] && hospitalData[id].email) {
          const email = hospitalData[id].email;
          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
            const user = userCredential.user;

            // Navigate to the hospital page
            navigation.navigate("hospital");
            return;
          } catch (error) {
            console.log(error.code);
            setIsLoading(false);
            setId("");
            setPassword("");
            setIdError("Invalid ID or Password");
            setPasswordError("Invalid ID or Password");
          }
        }
      }
      const pharmacyQuery = ref(db, "users/medical_units/pharmacy");
      const pharmacySnapshot = await get(pharmacyQuery);

      if (pharmacySnapshot.exists()) {
        const pharmacyData = pharmacySnapshot.val();

        // Check if the user ID exists in the pharmacy node
        if (pharmacyData && pharmacyData[id] && pharmacyData[id].email) {
          const email = pharmacyData[id].email;
          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
            const user = userCredential.user;

            // Navigate to the pharmacy page
            navigation.navigate("pharmacy");
            return;
          } catch (error) {
            console.log(error.code);
            setIsLoading(false);
            setId("");
            setPassword("");
            setIdError("Invalid ID or Password");
            setPasswordError("Invalid ID or Password");
          }
        }
      }
      const laboratoryQuery = ref(db, "users/medical_units/laboratory");
      const laboratorySnapshot = await get(laboratoryQuery);

      if (laboratorySnapshot.exists()) {
        const laboratoryData = laboratorySnapshot.val();

        // Check if the user ID exists in the laboratory node
        if (laboratoryData && laboratoryData[id] && laboratoryData[id].email) {
          const email = laboratoryData[id].email;
          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
            const user = userCredential.user;

            // Navigate to the laboratory page
            navigation.navigate("laboratory");
            return;
          } catch (error) {
            console.log(error.code);
            setIsLoading(false);
            setId("");
            setPassword("");
            setIdError("Invalid ID or Password");
            setPasswordError("Invalid ID or Password");
          }
        }
      }
      setId("");
      setPassword("");
      setIdError("Invalid ID or Password");
      setPasswordError("Invalid ID or Password");
    } catch (error) {
      console.error("Error signing in:", error);

      if (error.code === "auth/user-not-found") {
        setIsLoading(false);
        alert("User not found. Please check your ID.");
      } else {
        // Handle other errors with a generic message
        setIsLoading(false);
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
          <Text style={{ textAlign: "center", color: "white" }}>
            {isLoading ? "Logging in" : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginForm;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import styles from "../../styles/patientStyles/loginStyle";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginForm = ({ navigation }) => {
  const [id, setId] = useState();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [idError, setIdError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSecure, setPasswordSecure] = useState(true);

  const signIn = async () => {
    if (id === null || password === "") {
      setIdError("This Field Is Required");
      setPasswordError("This Field Is Required");
      return;
    } else {
      setIdError(null);
      setPasswordError(null);
    }
    setIsLoading(true);

    const roles = [
      "patients",
      "medical_units/hospital",
      "medical_units/pharmacy",
      "medical_units/laboratory",
    ];

    for (const role of roles) {
      const roleQuery = ref(db, `users/${role}`);
      const roleSnapshot = await get(roleQuery);

      if (roleSnapshot.exists()) {
        const roleData = roleSnapshot.val();

        if (roleData && roleData[id] && roleData[id].email) {
          const email = roleData[id].email;

          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
            const user = userCredential.user;

            // Navigate to the appropriate page based on the role
            await AsyncStorage.setItem("userRole", role);
            await AsyncStorage.setItem("userID", String(id));
            setId(null);
            setPassword("");

            const rolePage = getRolePage(role);
            navigation.navigate(rolePage, { userId: id });
            setIsLoading(false);

            return;
          } catch (error) {
            alert(error.code);
            handleSignInError();
            setIsLoading(false);
          }
        }
      }
    }

    handleSignInError();
    setIsLoading(false);
  };

  const getRolePage = (role) => {
    switch (role) {
      case "patients":
        return "patientPage";
      case "medical_units/hospital":
        return "hospital";
      case "medical_units/pharmacy":
        return "pharmacy";
      case "medical_units/laboratory":
        return "laboratory";
      default:
        return "";
    }
  };

  const handleSignInError = () => {
    setIsLoading(false);
    setId(null);
    setPassword("");
    setIdError("Invalid ID or Password");
    setPasswordError("Invalid ID or Password");
  };
  const resetPassword = () => {
    navigation.navigate("resetPasswordScreen");
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <View>
          <Text style={{ fontSize: 16, marginBottom: 5, marginTop: 0 }}>
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
          <React.Fragment>
            <TextInput
              style={styles.input}
              placeholder={
                passwordError ? passwordError : "Enter your password"
              }
              placeholderTextColor={passwordError ? "red" : "gray"}
              secureTextEntry={passwordSecure}
              autoCapitalize="none"
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <AntDesign
              style={{ position: "absolute", right: 15, top: 45 }}
              name={passwordSecure ? "eye" : "eyeo"}
              size={24}
              color="black"
              onPress={() => {
                setPasswordSecure((prev) => !prev);
              }}
            />
          </React.Fragment>
        </View>
        <View style={styles.underInput}>
          <TouchableOpacity style={styles.forgetPass} onPress={resetPassword}>
            <Text style={{ color: "blue" }}>forget password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={signIn}>
          <Text style={{ textAlign: "center", color: "white" }}>
            {isLoading ? <ActivityIndicator size="small" /> : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginForm;

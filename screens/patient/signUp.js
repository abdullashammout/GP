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
import styles from "../../styles/patientStyles/signUpStyle";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../../firebase";
import { ref, get, update } from "firebase/database";

const SignUPForm = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isPasswordMatching, setIsPasswordMatching] = useState(null);
  const [idError, setIdError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const handleSignUp = async () => {
    if (
      id === "" ||
      password === "" ||
      confirmPassword === "" ||
      email === ""
    ) {
      setIdError("This Field Required");
      setPasswordError("This Field Required");
      setConfirmPasswordError("This Field Required");
      setEmailError("This Field Required");
      return;
    } else {
      setIdError(null);
      setPasswordError(null);
      setConfirmPasswordError(null);
      setEmailError(null);
    }

    if (password === confirmPassword) {
      setIsPasswordMatching(null);
      try {
        const idRef = ref(db, "users/" + id);
        const idSnapshot = await get(idRef);
        const emailRef = ref(db, "users/" + id + "/email");
        const emailSnapshot = await get(emailRef);

        if (idSnapshot.exists()) {
          if (emailSnapshot.exists()) {
            Alert.alert("Account Exist", "User already has an account.");
          } else {
            try {
              const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
              );

              const user = userCredential.user;
              update(idRef, {
                email: email,
                password: password,
              });
              setEmail("");
              setId("");
              setPassword("");
              setConfirmPassword("");
              alert("Registration Done successfully");
            } catch (error) {
              alert(error.message);
              if (error.message === "Firebase: Error (auth/invalid-email).") {
                setEmail("");
                setEmailError("invalid email");
              }
            }
          }
        } else {
          Alert.alert(
            "ID not found ",
            " Please enter the ID from your ID card."
          );
        }
      } catch (error) {
        console.log(error.message);
        alert(error.message);
        if (error.message === "Firebase: Error (auth/email-already-in-use).") {
          setEmail("");
          setEmailError("email already used");
        }
      }
    } else {
      setPassword("");
      setConfirmPassword("");
      setIsPasswordMatching("Password and confirm Password do not match.");
      return;
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <View style={styles.par}>
          <Text
            style={{ fontSize: 24, textAlign: "center", fontWeight: "bold" }}
          >
            Create Account
          </Text>
          <Text style={{ fontWeight: "100" }}>
            Create An Account To Get All Features
          </Text>
        </View>
        <View>
          <Text style={{ fontSize: 16, marginBottom: 5, marginTop: 250 }}>
            ID Number:
          </Text>
          <TextInput
            returnKeyType="next"
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor={idError ? "red" : "gray"}
            placeholder={idError ? idError : "Enter your ID"}
            value={id}
            onChangeText={(text) => setId(text)}
            maxLength={10}
            keyboardType="numeric"
          />
        </View>
        <View>
          <Text style={{ fontSize: 16, marginBottom: 5 }}>Password:</Text>
          <TextInput
            returnKeyType="next"
            style={styles.input}
            placeholderTextColor={
              isPasswordMatching || passwordError ? "red" : "gray"
            }
            placeholder={
              isPasswordMatching || passwordError
                ? passwordError || isPasswordMatching
                : "Enter Your Password"
            }
            autoCapitalize="none"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <View>
          <Text style={{ fontSize: 16, marginBottom: 5 }}>
            Confirm Password:
          </Text>
          <TextInput
            returnKeyType="next"
            style={styles.input}
            placeholderTextColor={
              isPasswordMatching || confirmPasswordError ? "red" : "gray"
            }
            placeholder={
              isPasswordMatching || confirmPasswordError
                ? confirmPasswordError || isPasswordMatching
                : "Enter Your Password"
            }
            autoCapitalize="none"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
        </View>
        <View>
          <Text style={{ fontSize: 16, marginBottom: 5 }}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder={emailError ? emailError : "Enter your email"}
            placeholderTextColor={emailError ? "red" : "gray"}
            value={email}
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={handleSignUp}>
          <Text style={{ textAlign: "center", color: "white" }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignUPForm;

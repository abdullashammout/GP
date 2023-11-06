import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import styles from "../../styles/patientStyles/signUpStyle";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../../firebase";
import { ref, set } from "firebase/database";

const SignUPForm = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSignUp = async () => {
    if (password === confirmPassword) {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          set(ref(db, "users/" + id), {
            id: id,
            email: email,
            password: password,
          });
          setEmail("");
          setId("");
          setPassword("");
          setConfirmPassword("");
          alert("registration done successfully");
        })
        .catch((error) => {
          alert(error.message);
        });
    } else {
      alert("Password and confirmPassword do not match.");
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
            returnKeyType="next"
            style={styles.input}
            placeholder="Enter your password"
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
            placeholder="Confirm Password"
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
            placeholder="Enter your email"
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

import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { auth, db } from "../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import styles from "../../styles/patientStyles/resetPasswordStyle";

const ResetPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);

  const isEmailValid = (email) => {
    const famousDomains = [
      "hotmail.com",
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "icloud.com",
      "aol.com",
      "mail.ru",
      "yandex.ru",
      "qq.com",
      "live.com",
      "protonmail.com",
    ];

    // Check if email contains '@'
    if (!email.includes("@")) {
      return false;
    }

    // Split the email into username and domain
    const [username, domain] = email.split("@");

    // Check if the domain is in the famous domains list
    if (!famousDomains.includes(domain)) {
      return false;
    }

    // Use a regular expression to validate the email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  // reset password function
  const handleResetPassword = async () => {
    if (email === "") {
      setEmail("");
      setEmailError("This Field is Required");
      return;
    }
    if (!isEmailValid(email)) {
      setEmail("");
      setEmailError(
        "Please enter a valid email address in the format user@example.com."
      );
      return;
    }
    try {
      const dbRef = ref(db, "users/patients");
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        const userIds = Object.keys(users);

        // Check if any user has the provided email
        const userWithGivenEmail = userIds.find(
          (userId) => users[userId].email === email
        );
        if (userWithGivenEmail) {
          await sendPasswordResetEmail(auth, email);
          setEmail("");
          Alert.alert(
            "Password Reset Email Sent",
            "Check your email for instructions to reset your password."
          );
        } else {
          setEmail("");
          setEmailError(
            "The entered email does not correspond to any existing account"
          );
        }
      } else {
      }
    } catch (error) {}
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <View style={{ alignSelf: "flex-start", marginLeft: 35, bottom: 5 }}>
          <Text style={{ textAlign: "left", fontSize: 16 }}>Email:</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder={emailError ? emailError : "Enter your email"}
          placeholderTextColor={emailError ? "red" : "gray"}
          value={email.trim()}
          onChangeText={(text) => setEmail(text)}
        />

        <TouchableOpacity
          style={styles.resetPasswordBtn}
          onPress={handleResetPassword}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Reset Password
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ResetPasswordScreen;

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
import styles from "../../../styles/drawerStyles/changeEmailStyles";
import { auth, db } from "../../../firebase";
import { ref, update } from "firebase/database";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  verifyBeforeUpdateEmail,
} from "firebase/auth";

export default function ChangeEmailScreen({ navigation, route }) {
  const { userId } = route.params || {};

  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentEmailError, setCurrentEmailError] = useState("");
  const [newEmailError, setNewEmailError] = useState("");

  const isEmailValid = (newEmail) => {
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
    if (!newEmail.includes("@")) {
      return false;
    }

    // Split the email into username and domain
    const [username, domain] = newEmail.split("@");

    // Check if the domain is in the famous domains list
    if (!famousDomains.includes(domain)) {
      return false;
    }

    // Use a regular expression to validate the email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(newEmail)) {
      return false;
    }

    return true;
  };

  const handleChangeEmail = async () => {
    if (currentEmail === "" || newEmail === "" || currentPassword === "") {
      setCurrentEmailError("This Field Is Required");
      setNewEmailError("This Field Is Required");
      setCurrentPasswordError("This Field Is Required");
      return;
    } else {
      setCurrentPasswordError(null);
      setCurrentEmailError(null);
      setNewEmailError(null);
    }
    if (!isEmailValid(newEmail)) {
      setNewEmail("");
      setNewEmailError(
        "Please enter a valid email address in the format user@example.com."
      );
      return;
    }

    try {
      const user = auth.currentUser;

      // Reauthenticate user before changing email
      const credential = EmailAuthProvider.credential(
        currentEmail,
        // You might need to ask the user to input their password for reauthentication
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await verifyBeforeUpdateEmail(user, newEmail);
      Alert.alert(
        "verify Email",
        "please verify your new email And then it will be changed"
      );
      const userData = ref(db, `users/patients/${userId}`);
      update(userData, {
        email: newEmail,
      });
      await updateEmail(user, newEmail);
      Alert("Email changed successfully");
      setCurrentEmail("");
      setNewEmail("");
    } catch (error) {
      // Handle errors here
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-login-credentials" ||
        error.code === "auth/wrong-password"
      ) {
        setCurrentEmail("");
        setCurrentPassword("");
        setCurrentEmailError("Invalid current Email or Password.");
        setCurrentPasswordError("Invalid current Email or Password.");
      } else if (error.code === "auth/invalid-email") {
        setNewEmail("");
        setNewEmailError(
          "Please enter a valid email address in the format user@example.com."
        );
      } else {
        Alert.alert(
          "Error",
          "An unexpected error occurred. Please try again later."
        );
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
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Current Email:</Text>
          <TextInput
            returnKeyType="next"
            autoCapitalize="none"
            style={styles.input}
            placeholder={
              currentEmailError ? currentEmailError : "Enter current Email"
            }
            placeholderTextColor={currentEmailError ? "red" : "gray"}
            value={currentEmail.trim()}
            onChangeText={(text) => setCurrentEmail(text)}
          />
          <Text style={styles.label}>Current Password:</Text>
          <TextInput
            returnKeyType="next"
            autoCapitalize="none"
            style={styles.input}
            placeholder={
              currentPasswordError
                ? currentPasswordError
                : "Enter current Email"
            }
            placeholderTextColor={currentPasswordError ? "red" : "gray"}
            value={currentPassword.trim()}
            onChangeText={(text) => setCurrentPassword(text)}
            secureTextEntry
          />
          <Text style={styles.label}>New Email:</Text>
          <TextInput
            returnKeyType="next"
            autoCapitalize="none"
            style={styles.input}
            placeholder={newEmailError ? newEmailError : "Enter New Email"}
            placeholderTextColor={newEmailError ? "red" : "gray"}
            value={newEmail.trim()}
            onChangeText={(text) => setNewEmail(text)}
          />
          <TouchableOpacity style={styles.button} onPress={handleChangeEmail}>
            <Text style={styles.buttonText}>Change Email</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

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
import { auth, db } from "../../../firebase";
import { ref, update } from "firebase/database";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  updateEmail,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      setNewEmailError("Invalid email");
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
      console.log(error.code);
      // Handle errors here
      if (
        error.code === "auth/invalid-email" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-login-credentials"
      ) {
        setCurrentEmail("");
        setCurrentPassword("");
        setCurrentEmailError("Invalid Email or Password.");
        setCurrentPasswordError("Invalid Email or Password.");
      }
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            position: "absolute",
            top: 20,
            left: 15,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 17, left: 25 }}>
            Current Email:
          </Text>
          <TextInput
            returnKeyType="next"
            autoCapitalize="none"
            style={{
              padding: 10,
              marginTop: 10,
              marginLeft: 15,
              height: 60,
              width: 350,
              borderRadius: 10,
              borderColor: "white",
              borderWidth: 2,
            }}
            placeholder={
              currentEmailError ? currentEmailError : "Enter current Email"
            }
            placeholderTextColor={currentEmailError ? "red" : "gray"}
            value={currentEmail.trim()}
            onChangeText={(text) => setCurrentEmail(text)}
          />
          <Text style={{ fontWeight: "bold", fontSize: 17, left: 25 }}>
            Current Password:
          </Text>
          <TextInput
            returnKeyType="next"
            autoCapitalize="none"
            style={{
              padding: 10,
              marginTop: 10,
              marginLeft: 15,
              height: 60,
              width: 350,
              borderRadius: 10,
              borderColor: "white",
              borderWidth: 2,
            }}
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
          <Text style={{ fontWeight: "bold", fontSize: 17, left: 25 }}>
            New Email:
          </Text>

          <TextInput
            returnKeyType="next"
            autoCapitalize="none"
            style={{
              padding: 10,
              marginTop: 10,
              marginLeft: 15,
              height: 60,
              width: 350,
              borderRadius: 10,
              borderColor: "white",
              borderWidth: 2,
            }}
            placeholder={newEmailError ? newEmailError : "Enter New Email"}
            placeholderTextColor={newEmailError ? "red" : "gray"}
            value={newEmail.trim()}
            onChangeText={(text) => setNewEmail(text)}
          />
          <TouchableOpacity
            style={{
              marginTop: 50,
              width: 280,
              borderColor: "white",
              padding: 10,
              backgroundColor: "black",
              borderWidth: 1,
              borderRadius: 10,
              left: 50,
            }}
            onPress={handleChangeEmail}
          >
            <Text style={{ textAlign: "center", color: "white" }}>
              Change Email
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

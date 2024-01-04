import React, { useState } from "react";
import { auth } from "../../../firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import styles from "../../../styles/drawerStyles/changePasswordStyle";

export default function ChangePassScreen() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [oldError, setOldError] = useState("");
  const [newError, setNewError] = useState("");
  const [confError, setConfError] = useState("");

  const handleChangePassword = async () => {
    if (oldPassword === "" || newPassword === "" || confirmNewPassword === "") {
      setOldError("This Field Is Required");
      setNewError("This Field Is Required");
      setConfError("This Field Is Required");
      return;
    } else {
      setOldError(null);
      setNewError(null);
      setConfError(null);
    }
    if (newPassword === confirmNewPassword) {
      if (newPassword.length < 6) {
        setNewPassword("");
        setConfirmNewPassword("");
        setNewError("Password must be at least 6 characters long.");
        setConfError("Password must be at least 6 characters long.");
        return;
      }

      if (!/[A-Z]/.test(newPassword)) {
        setNewPassword("");
        setConfirmNewPassword("");
        setNewError("Password must contain at least one uppercase letter.");
        setConfError("Password must contain at least one uppercase letter.");
        return;
      }

      if (!/[a-z]/.test(newPassword)) {
        setNewPassword("");
        setConfirmNewPassword("");
        setNewError("Password must contain at least one lowercase letter.");
        setConfError("Password must contain at least one lowercase letter.");
        return;
      }

      if (!/\d/.test(newPassword)) {
        setNewPassword("");
        setConfirmNewPassword("");
        setNewError("Password must contain at least one number.");
        setConfError("Password must contain at least one number.");
        return;
      }
    } else {
      setNewPassword("");
      setConfirmNewPassword("");
      setNewError("Password and confirm Password do not match.");
      setConfError("Password and confirm Password do not match.");
      return;
    }

    try {
      const user = auth.currentUser;
      const credential = await EmailAuthProvider.credential(
        user.email,
        oldPassword
      );

      // Reauthenticate the user
      await reauthenticateWithCredential(user, credential);

      // Change the password
      await updatePassword(user, newPassword);

      Alert.alert("Success", "Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setOldPassword("");
        setOldError("Invalid current password");
      } else if (error.code === "auth/invalid-login-credentials") {
        setOldPassword("");
        setOldError("Invalid current password");
      } else {
        console.log(error);
        Alert.alert("Error", "An error occurred. Please try again.");
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
          <Text style={styles.label}>Current Password:</Text>
          <TextInput
            returnKeyType="next"
            autoCapitalize="none"
            style={styles.input}
            placeholder={oldError ? oldError : "Enter Old Password"}
            placeholderTextColor={oldError ? "red" : "gray"}
            value={oldPassword}
            onChangeText={(text) => setOldPassword(text)}
          />
          <Text style={styles.label}>New Password:</Text>
          <TextInput
            returnKeyType="next"
            autoCapitalize="none"
            style={styles.input}
            placeholder={newError ? newError : "Enter New Password"}
            placeholderTextColor={newError ? "red" : "gray"}
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
          />
          <Text style={styles.label}>Confirm New Password:</Text>
          <TextInput
            returnKeyType="next"
            autoCapitalize="none"
            style={styles.input}
            placeholder={confError ? confError : "Confirm New Password"}
            placeholderTextColor={confError ? "red" : "gray"}
            value={confirmNewPassword}
            onChangeText={(text) => setConfirmNewPassword(text)}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleChangePassword}
          >
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

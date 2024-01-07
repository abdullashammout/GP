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
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import styles from "../../../styles/drawerStyles/changePasswordStyle";

export default function ChangePassScreen() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [oldError, setOldError] = useState("");
  const [newError, setNewError] = useState("");
  const [confError, setConfError] = useState("");
  const [oldPasswordSecure, setOldPasswordSecure] = useState(true);
  const [newPasswordSecure, setNewPasswordSecure] = useState(true);
  const [loading, setLoading] = useState(false);

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
      if (!/^[a-zA-Z0-9!@#$%^&*]+$/.test(newPassword)) {
        setNewPassword("");
        setConfirmNewPassword("");
        setNewError(
          "Only letters, numbers, and the following special characters are allowed: !@#$%^&*"
        );
        setConfError(
          "Only letters, numbers, and the following special characters are allowed: !@#$%^&*"
        );
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
      if (
        !/^[a-zA-Z0-9!@#$%^&*]+$/.test(newPassword) ||
        !/[!@#$%^&*]/.test(newPassword)
      ) {
        setNewPassword("");
        setConfirmNewPassword("");
        setNewError(
          "Password must contain at least one special character (!@#$%^&*)"
        );
        setConfError(
          "Password must contain at least one special character (!@#$%^&*)"
        );
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

    setLoading(true);
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
      setLoading(false);
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setOldPassword("");
        setOldError("Invalid current password");
        setLoading(false);
      } else if (error.code === "auth/invalid-login-credentials") {
        setOldPassword("");
        setOldError("Invalid current password");
        setLoading(false);
      } else {
        Alert.alert("Error", "An error occurred. Please try again.");
        setLoading(false);
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
          <React.Fragment>
            <TextInput
              returnKeyType="next"
              autoCapitalize="none"
              style={styles.input}
              placeholder={oldError ? oldError : "Enter Old Password"}
              placeholderTextColor={oldError ? "red" : "gray"}
              value={oldPassword}
              secureTextEntry={oldPasswordSecure}
              onChangeText={(text) => setOldPassword(text)}
            />
            <AntDesign
              style={{ position: "absolute", right: 15, top: 52 }}
              name={oldPasswordSecure ? "eye" : "eyeo"}
              size={24}
              color="black"
              onPress={() => {
                setOldPasswordSecure((prev) => !prev);
              }}
            />
          </React.Fragment>
          <Text style={styles.label}>New Password:</Text>
          <React.Fragment>
            <TextInput
              returnKeyType="next"
              autoCapitalize="none"
              style={styles.input}
              placeholder={newError ? newError : "Enter New Password"}
              placeholderTextColor={newError ? "red" : "gray"}
              value={newPassword}
              secureTextEntry={newPasswordSecure}
              onChangeText={(text) => setNewPassword(text)}
            />
            <AntDesign
              style={{ position: "absolute", right: 15, top: 150 }}
              name={newPasswordSecure ? "eye" : "eyeo"}
              size={24}
              color="black"
              onPress={() => {
                setNewPasswordSecure((prev) => !prev);
              }}
            />
          </React.Fragment>
          <Text style={styles.label}>Confirm New Password:</Text>
          <TextInput
            returnKeyType="next"
            autoCapitalize="none"
            style={styles.input}
            placeholder={confError ? confError : "Confirm New Password"}
            placeholderTextColor={confError ? "red" : "gray"}
            value={confirmNewPassword}
            secureTextEntry={newPasswordSecure}
            onChangeText={(text) => setConfirmNewPassword(text)}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleChangePassword}
          >
            <Text style={styles.buttonText}>
              {loading ? <ActivityIndicator size="small" /> : "Change Password"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

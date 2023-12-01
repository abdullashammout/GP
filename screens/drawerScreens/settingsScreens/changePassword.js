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
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      await AsyncStorage.setItem("pass", newPassword);

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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            position: "absolute",
            top: 20,
            left: 15,
          }}
        >
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
            placeholder={oldError ? oldError : "Enter Old Password"}
            placeholderTextColor={oldError ? "red" : "gray"}
            value={oldPassword}
            onChangeText={(text) => setOldPassword(text)}
          />
          <Text style={{ fontWeight: "bold", fontSize: 17, left: 25 }}>
            New Password:
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
            placeholder={newError ? newError : "Enter New Password"}
            placeholderTextColor={newError ? "red" : "gray"}
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
          />
          <Text style={{ fontWeight: "bold", fontSize: 17, left: 25 }}>
            Confirm New Password:
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
            placeholder={confError ? confError : "Confirm New Password"}
            placeholderTextColor={confError ? "red" : "gray"}
            value={confirmNewPassword}
            onChangeText={(text) => setConfirmNewPassword(text)}
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
            onPress={handleChangePassword}
          >
            <Text style={{ textAlign: "center", color: "white" }}>
              {" "}
              Change Password
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

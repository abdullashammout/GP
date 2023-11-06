import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Checkbox from "expo-checkbox";
import styles from "../../styles/patientStyles/loginStyle";

const LoginForm = ({ navigation }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setChecked] = useState(false);

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
            placeholder="Enter your ID"
            value={id}
            onChangeText={(text) => setId(text)}
          />
        </View>
        <View>
          <Text style={{ fontSize: 16, marginBottom: 5 }}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
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
        <TouchableOpacity style={styles.loginBtn}>
          <Text style={{ textAlign: "center", color: "white" }}>Login</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginForm;

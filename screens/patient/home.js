import { View, Image, TouchableOpacity, Text } from "react-native";
import styles from "../../styles/patientStyles/HomeStyle";

export default function PatientHome({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.Logo}>
        <Image source={require("../../assets/LOGO.jpeg")} />
      </View>
      <Text style={{ position: "absolute", left: 70, bottom: 210 }}>
        Don't Have Account? Sign Up
      </Text>
      <TouchableOpacity style={styles.signUp}>
        <Text style={{ textAlign: "center", color: "white" }}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={{ position: "absolute", left: 70, bottom: 140 }}>
        Already Have Account? Login
      </Text>
      <TouchableOpacity style={styles.login}>
        <Text style={{ textAlign: "center", color: "white" }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

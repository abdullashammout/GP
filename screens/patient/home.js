import { View, Image, TouchableOpacity, Text } from "react-native";
import styles from "../../styles/patientStyles/HomeStyle";
import { Ionicons } from "@expo/vector-icons";

export default function PatientHome({ navigation }) {
  //navigate to login page
  const hangleLogin = () => {
    navigation.navigate("Login");
  };
  //navigate back to home
  const back = () => {
    navigation.navigate("home");
  };
  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };
  return (
    <View style={styles.container}>
      <View style={styles.Logo}>
        <Image source={require("../../assets/LOGO.jpeg")} />
      </View>
      <Text style={{ position: "absolute", left: 70, bottom: 210 }}>
        Don't Have Account? Sign Up
      </Text>
      <TouchableOpacity style={styles.signUp} onPress={handleSignUp}>
        <Text style={{ textAlign: "center", color: "white" }}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={{ position: "absolute", left: 70, bottom: 140 }}>
        Already Have Account? Login
      </Text>
      <TouchableOpacity style={styles.login} onPress={hangleLogin}>
        <Text style={{ textAlign: "center", color: "white" }}>Login</Text>
      </TouchableOpacity>
      <Ionicons
        style={{ position: "absolute", left: 20, top: 25 }}
        name="arrow-back"
        size={24}
        color="black"
        onPress={back}
      />
    </View>
  );
}

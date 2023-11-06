import { Text, View, Image, TouchableOpacity } from "react-native";
import styles from "../styles/homeStyle";

export default function Home({ navigation }) {
  //navigate to patient Home Screen
  const handlePatient = () => {
    navigation.navigate("patientHome");
  };
  const handleMedicalUnit = () => {
    navigation.navigate("login");
  };
  return (
    <View style={styles.container}>
      <View style={styles.Logo}>
        <Image source={require("../assets/LOGO.jpeg")} />
      </View>
      <TouchableOpacity style={styles.patient} onPress={handlePatient}>
        <Text style={{ textAlign: "center", color: "white" }}>Patient</Text>
      </TouchableOpacity>
      <Text style={{ position: "absolute", bottom: 245 }}>OR</Text>
      <TouchableOpacity style={styles.MedicalUnit} onPress={handleMedicalUnit}>
        <Text style={{ textAlign: "center", color: "white" }}>
          Medical Unit
        </Text>
      </TouchableOpacity>
    </View>
  );
}

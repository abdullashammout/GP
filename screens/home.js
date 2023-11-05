import { Text, View, Image, TouchableOpacity } from "react-native";
import styles from "../styles/homeStyle";

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.Logo}>
        <Image source={require("../assets/LOGO.jpeg")} />
      </View>
      <TouchableOpacity style={styles.patient}>
        <Text style={{ textAlign: "center", color: "white" }}>patient</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.MedicalUnit}>
        <Text style={{ textAlign: "center", color: "white" }}>
          Medical Unit
        </Text>
      </TouchableOpacity>
    </View>
  );
}

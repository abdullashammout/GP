import React from "react";
import { View, Text } from "react-native";
import styles from "../../styles/drawerStyles/aboutUsStyle";

export default function AboutUsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Welcome to E-HEALTH! We are dedicated to providing a seamless and
        enjoyable experience for our users. Our mission is to create an
        electronic health record for all citizens, leveraging the evolution of
        technology and digitalization to offer healthcare providers a
        digitalized way to check patients’ complete medical history securely. We
        employ state-of-the-art security protocols to protect your personal
        information and prevent identity theft or compromise.
      </Text>
      <Text style={styles.teamHeader}>Our Team:</Text>
      <Text style={styles.teamMember}>- Abdulla Shammout</Text>
      <Text style={styles.teamMember}>- Sara Abu-Nahel</Text>
      <Text style={styles.teamMember}>- Dania Isawi</Text>
    </View>
  );
}

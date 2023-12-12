import React from "react";
import { View, Text } from "react-native";

export default function AboutUsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{ fontSize: 18, textAlign: "center", paddingHorizontal: 20 }}
      >
        Welcome to E-HEALTH! We are dedicated to providing a seamless and
        enjoyable experience for our users. Our mission is to create an
        electronic health record for all citizens, leveraging the evolution of
        technology and digitalization to offer healthcare providers a
        digitalized way to check patients’ complete medical history securely. We
        employ state-of-the-art security protocols to protect your personal
        information and prevent identity theft or compromise.
      </Text>
      <Text style={{ marginTop: 20, fontWeight: "bold", fontSize: 16 }}>
        Our Team:
      </Text>
      <Text>- Abdulla Shammout</Text>
      <Text>- Sara Abu-Nahel</Text>
      <Text>- Dania Isawi</Text>
      {/* Add more team members as needed */}
    </View>
  );
}

import React from "react";
import { View, Text } from "react-native";

export default function PrivacyScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{ fontSize: 18, textAlign: "center", paddingHorizontal: 20 }}
      >
        Your privacy is important to us. This Privacy Policy explains how we
        collect, use, and protect your personal information when you use
        E-HEALTH. We employ state-of-the-art security protocols to ensure the
        protection of your personal information and prevent identity theft or
        compromise. Our application allows healthcare providers to instantly
        view and modify any patient’s medical record securely by entering their
        national identification number, making it easier to manage their
        healthcare needs.
      </Text>
      <Text style={{ marginTop: 20, fontWeight: "bold", fontSize: 16 }}>
        Information We Collect:
      </Text>
      <Text>
        - [List the types of information collected, such as user account data,
        device information, etc.]
      </Text>
      <Text style={{ marginTop: 10, fontWeight: "bold", fontSize: 16 }}>
        How We Use Your Information:
      </Text>
      <Text>
        - [Explain the purposes for which the collected information is used,
        e.g., to improve the app, provide personalized content, etc.]
      </Text>
      <Text style={{ marginTop: 10, fontWeight: "bold", fontSize: 16 }}>
        Your Choices:
      </Text>
      <Text>
        - [Describe user options regarding data collection, opt-out choices,
        etc.]
      </Text>
      <Text style={{ marginTop: 10, fontWeight: "bold", fontSize: 16 }}>
        Contact Us:
      </Text>
      <Text>
        - [Provide contact information for users to reach out with privacy
        concerns or questions.]
      </Text>
    </View>
  );
}

import React from "react";
import { View, Text } from "react-native";
import styles from "../../styles/drawerStyles/privacyStyle";

export default function PrivacyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Your privacy is important to us. This Privacy Policy explains how we
        collect, use, and protect your personal information when you use
        E-HEALTH. We employ state-of-the-art security protocols to ensure the
        protection of your personal information and prevent identity theft or
        compromise. Our application allows healthcare providers to instantly
        view and modify any patient’s medical record securely by entering their
        national identification number, making it easier to manage their
        healthcare needs.
      </Text>
      <Text style={styles.header}>Information We Collect:</Text>
      <Text style={styles.listItem}>
        - Citizen ID {"\n"}- Citizen name {"\n"}- Citizen Age {"\n"}- Citizen
        Gender
      </Text>

      <Text style={[styles.header, styles.contactHeader]}>Contact Us:</Text>
      <Text style={styles.contactText}>
        - Send message to our customer service:{"\n"}
        {"-------------------------->  "}E-health@outlook.com
      </Text>
    </View>
  );
}

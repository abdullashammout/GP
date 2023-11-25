import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}

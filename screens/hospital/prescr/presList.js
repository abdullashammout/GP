import React from "react";
import { View, Text } from "react-native";

const PresList = ({ route }) => {
  const { itemId } = route.params;
  const { itemName } = route.params;
  const { medName } = route.params;
  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Prescription ID: {itemId}</Text>
      <Text>Doctor name: {itemName}</Text>
      <Text>{medName}</Text>
    </View>
  );
};

export default PresList;

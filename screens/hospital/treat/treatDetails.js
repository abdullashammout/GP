import { View, Text, StyleSheet } from "react-native";

const TreatmentDetails = ({ route }) => {
  const { itemId, itemName, medicalUnitName, patientId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Treatment Details</Text>
      <Text>Name: </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  name: {
    color: "black",
  },
});
export default TreatmentDetails;

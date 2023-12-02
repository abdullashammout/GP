import { View, Text, StyleSheet } from "react-native";

const TreatmentDetails = ({ route }) => {
  const { treatment } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Treatment Details</Text>
      <Text>Name: {treatment.name}</Text>
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

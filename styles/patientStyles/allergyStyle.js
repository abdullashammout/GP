import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  noAllergiesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noAllergiesText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
  allergyItem: {
    marginBottom: 8,
    backgroundColor: "#aed6f1", // Adjust the background color
    borderRadius: 12,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    marginRight: 5,
  },
});

export default styles;

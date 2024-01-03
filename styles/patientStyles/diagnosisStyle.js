import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  noDiagnosisContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDiagnosisText: {
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
  },
  label: {
    fontWeight: "bold",
    marginRight: 5,
  },
});

export default styles;

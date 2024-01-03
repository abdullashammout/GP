import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  treatmentItem: {
    backgroundColor: "#3498db",
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
  },
  flatlistContainer: {
    paddingBottom: 16,
  },
  itemHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
  },
  noTreatmentsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noTreatmentsText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
});

export default styles;

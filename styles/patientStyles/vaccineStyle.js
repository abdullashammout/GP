import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
  },
  historyHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  vaccineItem: {
    marginBottom: 8,
    backgroundColor: "#aed6f1", // Adjust the background color
    borderRadius: 12,
    padding: 16,
  },
  noVaccinesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noVaccinesText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
  bold: {
    fontWeight: "bold",
  },
});

export default styles;

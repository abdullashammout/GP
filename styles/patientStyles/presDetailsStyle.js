import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  medicationItem: {
    marginVertical: 10,
    backgroundColor: "#aed6f1", // Adjust the background color
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  medication: {
    fontStyle: "italic",
    color: "#777",
  },
  flatlist: {
    flexGrow: 0,
  },
  noMedicationsText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
  },
  soldItemContainer: {
    opacity: 0.5,
  },
  sell: {
    backgroundColor: "red",
    padding: 10,
    position: "absolute",
    borderRadius: 5,
    right: 15,
    bottom: 25,
  },
});
export default styles;

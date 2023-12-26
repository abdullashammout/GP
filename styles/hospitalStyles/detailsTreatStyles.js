import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  formContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  medicationItem: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#ADD8E6",
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#555",
  },
  medication: {
    paddingRight: 80,
    fontStyle: "italic",
    color: "#777",
  },
  input: {
    flex: 1,
    height: 80,
    borderColor: "gray",
    borderWidth: 1,
    marginLeft: 10,
    padding: 5,
    borderRadius: 8,
    backgroundColor: "white",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    right: 10,
    bottom: 30,
  },
  row: {
    flexDirection: "row",
  },
  detailsContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailsLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  checkEligibilityButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  checkEligibilityButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
export default styles;

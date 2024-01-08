import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderRadius: 30,
    height: 40,
    backgroundColor: "#f2f2f2",
    borderColor: "blue",
    borderWidth: 1,
    marginBottom: 6,
    paddingHorizontal: 8,
  },
  historyHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  bloodDonationItem: {
    marginBottom: 8,
    backgroundColor: "#aed6f1", // Adjust the background color
    borderRadius: 12,
    padding: 16,
  },
  deleteButton: {
    position: "absolute",
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 5,
    bottom: 10,
    right: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
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

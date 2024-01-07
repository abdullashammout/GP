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
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#2c3e50",
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  diagnosisItem: {
    marginBottom: 8,
    backgroundColor: "#aed6f1", // Adjust the background color
    borderRadius: 12,
    padding: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  bold: {
    fontWeight: "bold",
  },
  deleteButton: {
    position: "absolute",
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 5,
    bottom: 15,
    right: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  btns: {
    marginLeft: 17,
    top: 5,
    backgroundColor: "#3498db",
    bottom: 20,
    padding: 15,
    borderRadius: 12,
    margin: 5,
  },
});

export default styles;

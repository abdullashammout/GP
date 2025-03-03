import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
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
    textAlign: "center",
  },
});

export default styles;

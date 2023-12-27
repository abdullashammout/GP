import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    marginRight: 5,
    paddingLeft: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    padding: 8, // Adjust the padding to make the button fit better
    borderRadius: 5,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  chronicItem: {
    marginBottom: 8,
    backgroundColor: "#aed6f1", // Adjust the background color
    borderRadius: 12,
    padding: 16,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  textin: {
    paddingRight: 5,
  },
});

export default styles;

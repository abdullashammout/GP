import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 10,
    padding: 17,
    height: 60,
    width: 350,
    borderRadius: 10,
    borderColor: "#f0f0f0",
    borderWidth: 2,
    backgroundColor: "#34495e",
  },
  deleteButton: {
    marginTop: 10,
    padding: 17,
    height: 60,
    width: 350,
    borderRadius: 10,
    borderColor: "#f0f0f0",
    backgroundColor: "#e74c3c",
    borderWidth: 2,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
  },
});

export default styles;

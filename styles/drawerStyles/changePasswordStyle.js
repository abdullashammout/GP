import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    position: "absolute",
    top: 20,
    left: 15,
  },
  label: {
    fontWeight: "bold",
    fontSize: 17,
    left: 25,
  },
  input: {
    padding: 10,
    marginTop: 10,
    marginLeft: 15,
    height: 60,
    width: 350,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 2,
  },
  button: {
    marginTop: 50,
    width: 280,
    borderColor: "white",
    padding: 10,
    backgroundColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    left: 50,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
  },
});

export default styles;

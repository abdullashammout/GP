import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },

  loginBtn: {
    marginTop: 100,
    width: 280,
    borderColor: "#f0f0f0",
    padding: 10,
    backgroundColor: "#4169E1",
    borderWidth: 1,
    borderRadius: 10,
  },
  input: {
    padding: 5,
    height: 60,
    width: 350,
    borderRadius: 10,
    borderColor: "#f0f0f0",
    borderWidth: 2,
  },
  par: {
    position: "absolute",
    top: 20,
  },
});
export default styles;

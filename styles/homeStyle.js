import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  Logo: {
    position: "absolute",
    top: 30,
  },
  patient: {
    width: 280,
    borderColor: "white",
    padding: 10,
    backgroundColor: "#4169E1",
    borderWidth: 1,
    borderRadius: 10,
    shadowRadius: 10,
    position: "absolute",
    bottom: 160,
  },
  MedicalUnit: {
    width: 280,
    borderColor: "white",
    padding: 10,
    backgroundColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    shadowRadius: 10,
    position: "absolute",
    bottom: 100,
  },
});
export default styles;

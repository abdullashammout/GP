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
    justifyContent: "center",
    height: 60,
    width: 280,
    borderColor: "white",
    padding: 10,
    backgroundColor: "#4169E1",
    borderWidth: 1,
    borderRadius: 10,
    shadowRadius: 10,
    position: "absolute",
    bottom: 270,
  },
  MedicalUnit: {
    justifyContent: "center",
    height: 60,
    width: 280,
    borderColor: "white",
    padding: 10,
    backgroundColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    shadowRadius: 10,
    position: "absolute",
    bottom: 180,
  },
});
export default styles;

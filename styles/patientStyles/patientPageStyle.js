import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#4169E1",
    width: Dimensions.get("window").width * 0.6,
  },
  backButton: {
    position: "absolute",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 30,
  },
  patientName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },

  drawerHeader: {
    marginTop: 100,
    alignItems: "center",
    marginBottom: 20,
  },
});
export default styles;

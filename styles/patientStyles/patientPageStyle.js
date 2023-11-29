import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#34495e",
    width: Dimensions.get("window").width * 0.6,
    opacity: 0.9,
  },
  backButton: {
    position: "absolute",
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    marginTop: 80,
    padding: 10,
    alignItems: "flex-start",
    marginLeft: 10,
    marginBottom: 20,
  },
  drawerOptions: {
    marginTop: 20,
    marginLeft: 15,
  },
  optionText: {
    color: "white",
    paddingLeft: 5,
  },
  drawerCloseArea: {
    position: "absolute",
    top: 0,
    left: "60%",
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0)",
  },
  item: {
    backgroundColor: "#3498db",
    padding: 80,
    margin: 8,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    height: 140,
    width: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 14,
    position: "absolute",
    bottom: 5,
    color: "white",
  },
  image: {
    height: 100,
    width: 100,
    marginBottom: 10,
  },
  container: {
    top: 130,
  },
});
export default styles;

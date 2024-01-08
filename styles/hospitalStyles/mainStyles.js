import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  flatcontainer: {
    top: 10,
  },
  item: {
    backgroundColor: "#3498db",
    padding: 10,
    margin: 8,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    height: 130,
    maxWidth: "46%", // Maximum width for each item (2 items in a row)
  },
  title: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
  },
  image: {
    height: 90,
    width: 90,
    marginBottom: 10,
  },
  patientInfoContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    margin: 10,
    marginVertical: 2,
    padding: 15,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  info: {
    color: "#555",
  },
  lastItem: {
    marginRight: "auto", // Set the right margin to auto for centering
    marginLeft: "auto", // Set the left margin to auto for centering
  },
});
export default styles;

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  itemContainer: {
    backgroundColor: "#ADD8E6",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    backgroundColor: "#e74c3c",
    padding: 10,
    marginLeft: 5, // Add some space between buttons
    borderRadius: 5,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  addItem: {
    backgroundColor: "#3498db",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    padding: 10,
    paddingHorizontal: 90,
    borderRadius: 10,
  },
  btns: {
    marginLeft: 17,
    top: 5,
    backgroundColor: "#3498db",
    bottom: 20,
    padding: 15,
    borderRadius: 8,
    margin: 5,
  },
});

export default styles;

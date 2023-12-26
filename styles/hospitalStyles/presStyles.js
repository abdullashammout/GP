import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#3498db",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3, // Add elevation for shadow on Android
    shadowColor: "#000", // Add shadow for iOS
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  itemInfo: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white", // black for text
  },
  dateText: {
    marginTop: 5,
    color: "white", // black for text
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
    padding: 45,
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
    alignSelf: "flex-end",
    backgroundColor: "#e74c3c",
    padding: 10,
    marginTop: 38,
    borderRadius: 5,
  },
  buttonContainer: {
    position: "absolute",
    right: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "black", // black for text
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 40,
    paddingVertical: 8,
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1,
  },
  addItem: {
    backgroundColor: "#3498db",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    padding: 10,
    paddingHorizontal: 103,
    borderRadius: 8,
  },
});

export default styles;

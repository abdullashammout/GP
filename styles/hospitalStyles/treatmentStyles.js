import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  dateText: {
    marginTop: 5,
    color: "white", // black for text
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  treatmentItem: {
    backgroundColor: "#3498db",
    borderRadius: 8,
    elevation: 3, // Add elevation for shadow on Android
    shadowColor: "#000", // Add shadow for iOS
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  buttonContainer: {
    position: "absolute",
    alignSelf: "flex-end",
    top: 80,
    right: 15,
  },
  button: {
    backgroundColor: "#e74c3c",
    padding: 10,
    marginLeft: 5, // Add some space between buttons
    borderRadius: 5,
  },
  checkEligibilityButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  checkEligibilityButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default styles;

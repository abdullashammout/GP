import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Light background color
  },
  infoContainer: {
    marginTop: 20,
    flexDirection: "row",
    backgroundColor: "#fff", // White background for info container
    padding: 10,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    paddingHorizontal: 80,
    paddingVertical: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3498db", // Blue label color
  },
  valueContainer: {
    marginLeft: 20,
  },
  value: {
    fontStyle: "italic",
    fontWeight: "500",
    color: "#2c3e50", // Dark text color
  },
});

export default styles;

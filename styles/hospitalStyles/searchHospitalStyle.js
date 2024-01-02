import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    marginTop: 20,
    padding: 10,
    height: 60,
    width: 350,
    borderRadius: 10,
    borderColor: "#f0f0f0",
    borderWidth: 2,
  },
  searchBtn: {
    marginTop: 50,
    width: 280,
    borderColor: "white",
    padding: 10,
    backgroundColor: "black",
    borderWidth: 1,
    borderRadius: 10,
  },
  searchBtnText: {
    color: "white",
    textAlign: "center",
  },
  logout: {
    backgroundColor: "#e74c3c",
    padding: 2,
    borderRadius: 5,
    flexDirection: "row",
    position: "absolute",
    top: 22,
    left: 14,
    paddingVertical: 5,
  },
  hospitalName: {
    fontStyle: "italic",
    position: "absolute",
    top: 20,
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default styles;

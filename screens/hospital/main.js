import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";

export default function MainScreen({ navigation }) {
  const data = [
    {
      index: "1",
      title: "Prescriptions",
      image: require("../../pics/pres.png"),
    },
    {
      index: "2",
      title: "Diagnosis",
      image: require("../../pics/diagnosis.png"),
    },
    { index: "3", title: "Treatments", image: require("../../pics/treat.png") },
    { index: "4", title: "Vaccine", image: require("../../pics/vaccine.png") },
    {
      index: "5",
      title: "Allergies",
      image: require("../../pics/allergy.png"),
    },
    {
      index: "6",
      title: "Lab results",
      image: require("../../pics/results.png"),
    },
    {
      index: "7",
      title: "Blood donation",
      image: require("../../pics/blood.png"),
    },
    {
      index: "8",
      title: "Hospital stay",
      image: require("../../pics/stay.png"),
    },
  ];

  const toPresc = (index) => {
    if (index === "1") {
      navigation.navigate("Prescription");
    }
    if (index === "2") {
      navigation.navigate("diagnosis");
    }
    if (index === "3") {
      navigation.navigate("treatments");
    }
    if (index === "4") {
      navigation.navigate("vaccine");
    }
    if (index === "5") {
      navigation.navigate("allergies");
    }
    if (index === "6") {
      navigation.navigate("lab");
    }
    if (index === "7") {
      navigation.navigate("BloodDonation");
    }
    if (index === "8") {
      navigation.navigate("hospitalStay");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => toPresc(item.index)}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.flatcontainer}>
        <FlatList
          key={"?"}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.index}
          numColumns={2} // Number of columns in the grindex
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  flatcontainer: {
    top: 50,
  },
  item: {
    backgroundColor: "lightblue",
    padding: 20,
    margin: 5,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    height: 150,
    width: 45,
  },
  title: {
    fontSize: 10,
  },
  image: {
    height: 100,
    width: 100,
    marginBottom: 10,
  },
});

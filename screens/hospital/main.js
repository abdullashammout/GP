import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";

export default function MainScreen({ route, navigation }) {
  const { patientId } = route.params;
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState(null);
  const [patientGender, setPatientGender] = useState(null);
  const [pId, setPId] = useState(null);
  useEffect(() => {
    // Fetch patient information from the database using the patientId
    const userRef = ref(db, `users/patients/${patientId}`);
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          // Set the patient name to state
          const { name } = snapshot.val();
          setPatientName(name);
          const { age } = snapshot.val();
          setPatientAge(age);
          const { gender } = snapshot.val();
          setPatientGender(gender);
          const { id } = snapshot.val();
          setPId(id);
        } else {
          console.log("Patient not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching patient data: ", error);
      });
  }, [patientId]);

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
      navigation.navigate("Prescription", { patientId });
    }
    if (index === "2") {
      navigation.navigate("diagnosis", { patientId });
    }
    if (index === "3") {
      navigation.navigate("treatments", { patientId });
    }
    if (index === "4") {
      navigation.navigate("vaccine", { patientId });
    }
    if (index === "5") {
      navigation.navigate("allergies", { patientId });
    }
    if (index === "6") {
      navigation.navigate("lab", { patientId });
    }
    if (index === "7") {
      navigation.navigate("BloodDonation", { patientId });
    }
    if (index === "8") {
      navigation.navigate("hospitalStay", { patientId });
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
      <View style={styles.patientInfoContainer}>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.info}>{patientName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.info}>{patientAge}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.info}>{patientGender}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>ID:</Text>
            <Text style={styles.info}>{pId}</Text>
          </View>
        </View>
      </View>
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
    height: 140,
  },
  title: {
    fontSize: 10,
    color: "white",
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
});

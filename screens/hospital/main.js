import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from "react-native";
import styles from "../../styles/hospitalStyles/mainStyles";
import { Ionicons } from "@expo/vector-icons";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";

export default function MainScreen({ route, navigation }) {
  const { patientId } = route.params;
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState(null);
  const [patientGender, setPatientGender] = useState(null);
  const [patientBloodType, setPatientBloodType] = useState("");
  const [pId, setPId] = useState(null);

  // Fetch patient information from the database using the patientId
  useEffect(() => {
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
          const { bloodType } = snapshot.val();
          setPatientBloodType(bloodType);
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
    { index: "4", title: "Vaccines", image: require("../../pics/vaccine.png") },
    {
      index: "5",
      title: "Hospital Entries",
      image: require("../../pics/stay.png"),
    },
    {
      index: "6",
      title: "Chronic Illnesses",
      image: require("../../pics/Chronic.png"),
    },
    {
      index: "7",
      title: "Blood donations",
      image: require("../../pics/blood.png"),
    },
    {
      index: "8",
      title: "Allergies",
      image: require("../../pics/allergy.png"),
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
      navigation.navigate("hospitalStay", { patientId });
    }
    if (index === "6") {
      navigation.navigate("chronic", { patientId });
    }
    if (index === "7") {
      navigation.navigate("BloodDonation", { patientId });
    }
    if (index === "8") {
      navigation.navigate("allergies", { patientId });
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
      <Text
        style={{
          textAlign: "center",
          margin: 18,
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        Patient Record
      </Text>
      <View style={styles.patientInfoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.info}>{patientName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.info}>{pId}</Text>
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
          <Text style={styles.label}>Blood Type:</Text>
          <Text style={styles.info}>{patientBloodType}</Text>
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
      <Ionicons
        style={{ position: "absolute", left: 20, top: 23 }}
        name="arrow-back"
        size={24}
        color="black"
        onPress={() => {
          Alert.alert(
            "Exit Confirmation",
            "Are you sure you want to exit patient record?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Exit",
                onPress: async () => {
                  navigation.goBack();
                },
              },
            ]
          );
        }}
      />
    </View>
  );
}

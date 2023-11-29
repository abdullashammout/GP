import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  Animated,
  FlatList,
  Image,
} from "react-native";
import {
  MaterialCommunityIcons,
  Ionicons,
  SimpleLineIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../styles/patientStyles/patientPageStyle";
import { ref, get } from "firebase/database";
import { db, auth } from "../../firebase";

export default function PatientPage({ navigation, route }) {
  const { userId } = route.params || {};
  const [patientName, setPatientName] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchPatientName = async () => {
      try {
        const userRef = ref(db, `users/patients/${userId}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const { name } = snapshot.val();
          await AsyncStorage.setItem("PatientName", name);
        }
      } catch (error) {
        console.error("Error fetching Patient data:", error);
      } finally {
        // Set loading to false when data is fetched or an error occurs
      }
    };

    fetchPatientName();
  }, [userId]);
  const getPatientName = async () => {
    const pName = await AsyncStorage.getItem("PatientName");
    setPatientName(pName);
  };
  getPatientName();

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setDrawerOpen(false);
    });
  };

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -Dimensions.get("window").width * 0.6],
  });

  const logout = async () => {
    Alert.alert("Logout Confirmation", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await auth.signOut(); // Sign out the user
            await AsyncStorage.removeItem("userRole");
            await AsyncStorage.removeItem("PatientName");
          } catch (error) {
            console.error("Error during logout:", error.message);
            // Show an error alert if there is an issue during logout
            Alert.alert(
              "Logout Error",
              "An error occurred during logout. Please try again."
            );
          }
        },
      },
    ]);
  };
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ecf0f1",
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          backgroundColor: "#3498db",
        }}
      >
        <View
          style={{
            backgroundColor: "#3498db",
            marginTop: 50,
            marginBottom: 16,
            paddingLeft: 40,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity onPress={openDrawer}>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
          <Text
            style={{
              paddingLeft: 70,
              fontSize: 18,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Medical Record
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <FlatList
          key={"?"}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.index}
          numColumns={2} // Number of columns in the grindex
        />
      </View>
      {drawerOpen && (
        <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
          <ScrollView>
            <TouchableOpacity style={styles.backButton} onPress={closeDrawer}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.drawerHeader}>
              <Ionicons
                name="md-person-circle-outline"
                size={65}
                color="white"
              />
              <Text style={styles.patientName}>{patientName}</Text>
            </View>
            <View style={{ width: 300, height: 1, backgroundColor: "white" }}>
              <Text></Text>
            </View>
            <View style={styles.drawerOptions}>
              <TouchableOpacity
                style={{ flexDirection: "row", paddingBottom: 15 }}
                onPress={() => {
                  navigation.navigate("Settings");
                }}
              >
                <SimpleLineIcons name="settings" size={17} color="white" />
                <Text style={styles.optionText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: "row", paddingBottom: 15 }}
                onPress={() => {
                  navigation.navigate("AccountInfo");
                }}
              >
                <MaterialCommunityIcons
                  name="account"
                  size={17}
                  color="white"
                />
                <Text style={styles.optionText}>Account Information</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: "row", paddingBottom: 15 }}
                onPress={() => {
                  navigation.navigate("AboutUs");
                }}
              >
                <MaterialCommunityIcons
                  name="progress-question"
                  size={17}
                  color="white"
                />
                <Text style={styles.optionText}>About Us</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => {
                  navigation.navigate("Privacy");
                }}
              >
                <MaterialIcons name="privacy-tip" size={17} color="white" />
                <Text style={styles.optionText}>Privacy Policy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  marginTop: 470,
                  flexDirection: "row",
                }}
                onPress={logout}
              >
                <SimpleLineIcons name="logout" size={24} color="white" />
                <Text style={styles.optionText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      )}
      {drawerOpen && (
        <TouchableOpacity
          style={styles.drawerCloseArea}
          onPress={closeDrawer}
        />
      )}
    </View>
  );
}

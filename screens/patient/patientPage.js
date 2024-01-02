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
  const { userId } = route.params;
  const [patientName, setPatientName] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [patientImage, setPatientImage] = useState(null); // New state for patient image URL
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const userInfo = ref(db, `users/patients/${userId}`);
        const snapshot = await get(userInfo);

        if (snapshot.exists()) {
          const { email, gender, age, picture, name, bloodType } =
            snapshot.val();

          await AsyncStorage.setItem("PatientEmail", email);
          await AsyncStorage.setItem("PatientId", userId);
          await AsyncStorage.setItem("PatientGender", gender);
          await AsyncStorage.setItem("PatientAge", age.toString());
          await AsyncStorage.setItem("PatientName", name);
          await AsyncStorage.setItem("PatientBloodType", bloodType);
          if (picture) {
            console.log("Image URL:", picture); // Add this console log
            setPatientImage(picture);
          } else {
            console.log("No image URL found in Firebase.");
          }
        }
      } catch (error) {
        console.error("Error fetching Patient data:", error);
      }
    };

    fetchPatientInfo();
  }, [userId]);

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
    { index: "4", title: "Vaccines", image: require("../../pics/vaccine.png") },
    {
      index: "5",
      title: "Hospital Entries",
      image: require("../../pics/stay.png"),
    },
    {
      index: "6",
      title: "Chronic Diseases",
      image: require("../../pics/Chronic.png"),
    },
    {
      index: "7",
      title: "Blood Donations",
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
      navigation.navigate("patientPres", { userId });
    }
    if (index === "2") {
      navigation.navigate("pDiagnosis", { userId });
    }
    if (index === "3") {
      navigation.navigate("pTreat", { userId });
    }
    if (index === "4") {
      navigation.navigate("patientVaccines", { userId });
    }
    if (index === "5") {
      navigation.navigate("pStay", { userId });
    }
    if (index === "6") {
      navigation.navigate("pChronic", { userId });
    }
    if (index === "7") {
      navigation.navigate("patientBloodDonations", { userId });
    }
    if (index === "8") {
      navigation.navigate("patientAllergies", { userId });
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
            marginTop: 20,
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
            My Medical Record
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
              {patientImage ? (
                <Image
                  source={{ uri: patientImage }}
                  style={{
                    width: 85,
                    height: 85,
                    borderRadius: 100,
                    backgroundColor: "white",
                  }}
                />
              ) : (
                <Ionicons
                  name="md-person-circle-outline"
                  size={85}
                  color="white"
                />
              )}
              <Text style={styles.patientName}>{patientName}</Text>
            </View>
            <View style={{ width: 300, height: 1, backgroundColor: "white" }}>
              <Text></Text>
            </View>
            <View style={styles.drawerOptions}>
              <TouchableOpacity
                style={{ flexDirection: "row", paddingBottom: 15 }}
                onPress={() => {
                  navigation.navigate("Settings", { userId });
                }}
              >
                <SimpleLineIcons name="settings" size={17} color="white" />
                <Text style={styles.optionText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: "row", paddingBottom: 15 }}
                onPress={() => {
                  navigation.navigate("AccountInfo", { userId });
                }}
              >
                <MaterialCommunityIcons
                  name="account"
                  size={17}
                  color="white"
                />
                <Text style={styles.optionText}>My Information</Text>
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
                  marginTop: 420,
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

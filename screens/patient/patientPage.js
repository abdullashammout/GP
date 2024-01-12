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
            setPatientImage(picture);
          } else {
          }
        }
      } catch (error) {}
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
          } catch (error) {}
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

    { index: "3", title: "Treatments", image: require("../../pics/treat.png") },
    { index: "4", title: "Vaccines", image: require("../../pics/vaccine.png") },
    {
      index: "5",
      title: "Allergies",
      image: require("../../pics/allergy.png"),
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
      title: "Hospital Entries",
      image: require("../../pics/stay.png"),
    },
  ];
  const toPresc = (index) => {
    if (index === "1") {
      navigation.navigate("patientPres", { userId });
    }

    if (index === "3") {
      navigation.navigate("pTreat", { userId });
    }
    if (index === "4") {
      navigation.navigate("patientVaccines", { userId });
    }
    if (index === "5") {
      navigation.navigate("patientAllergies", { userId });
    }
    if (index === "6") {
      navigation.navigate("pChronic", { userId });
    }
    if (index === "7") {
      navigation.navigate("patientBloodDonations", { userId });
    }
    if (index === "8") {
      navigation.navigate("pStay", { userId });
    }
  };

  const renderItem = ({ item, index }) => {
    const isLastItem = index === data.length - 1; // Check if the item is the last one

    // Apply different styles for the last item to center it
    const itemStyle = isLastItem ? [styles.item, styles.lastItem] : styles.item;

    return (
      <TouchableOpacity style={itemStyle} onPress={() => toPresc(item.index)}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

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
                  navigation.navigate("ChangePassword");
                }}
              >
                <MaterialCommunityIcons
                  name="security"
                  size={17}
                  color="white"
                />
                <Text style={styles.optionText}>Change Password</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flexDirection: "row", paddingBottom: 15 }}
                onPress={() => {
                  navigation.navigate("ChangeEmail", { userId });
                }}
              >
                <MaterialIcons name="email" size={17} color="white" />
                <Text style={styles.optionText}>Change Email</Text>
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
                  marginTop: 390,
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

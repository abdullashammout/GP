import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
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
    const fetchHospitalName = async () => {
      try {
        const userRef = ref(db, `users/patients/${userId}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const { name } = snapshot.val();
          setPatientName(name);
        }
      } catch (error) {
        console.error("Error fetching hospital data:", error);
      } finally {
        // Set loading to false when data is fetched or an error occurs
      }
    };

    fetchHospitalName();
  }, [userId]);

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

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={{ position: "absolute", top: 60, left: 40 }}
        onPress={openDrawer}
      >
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>

      <Text>Hi, I am the patient page</Text>
      <TouchableOpacity
        style={{ position: "absolute", top: 60, right: 40 }}
        onPress={logout}
      >
        <MaterialCommunityIcons name="logout" size={24} color="black" />
      </TouchableOpacity>
      {drawerOpen && (
        <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
          <ScrollView>
            <TouchableOpacity style={styles.backButton} onPress={closeDrawer}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.drawerHeader}>
              <Ionicons
                name="md-person-circle-outline"
                size={60}
                color="white"
              />
              <Text style={styles.patientName}>{patientName}</Text>
            </View>
          </ScrollView>
        </Animated.View>
      )}
      {drawerOpen && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0,
            left: "60%",
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0)",
          }}
          onPress={closeDrawer}
        />
      )}
    </View>
  );
}

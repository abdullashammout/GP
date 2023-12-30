import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ref, get } from "firebase/database";
import { db } from "../../../firebase";

export default function PatientStay({ navigation, route }) {
  const { userId } = route.params;
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stayDataRef = ref(db, `users/patients/${userId}/HospitalStay`);
        const snapshot = await get(stayDataRef);
        const loadedData = [];

        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const itemData = childSnapshot.val();
            itemData.id = childSnapshot.key;
            loadedData.push(itemData);
          });

          setData(loadedData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [userId, data]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        navigation.navigate("PStayDetails", {
          itemId: item.id,
          patientId: userId,
        });
      }}
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemText}>hospital admission {index + 1}</Text>
        <Text style={styles.dateText}>
          hospital name: {item.medicalUnitName}
        </Text>
        <Text style={styles.dateText}>Doctor name:{item.createdBy}</Text>
        <Text style={styles.dateText}>entry date:{item.date}</Text>
        <Text style={styles.dateText}>entry time:{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {data.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>You have no hospital entries yet.</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#3498db",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3, // Add elevation for shadow on Android
    shadowColor: "#000", // Add shadow for iOS
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  itemInfo: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white", // black for text
  },
  dateText: {
    marginTop: 5,
    color: "white", // black for text
  },
});

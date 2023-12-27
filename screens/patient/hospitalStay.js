import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";

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
    <View style={styles.itemContainer}>
      <Text style={{ fontWeight: "bold" }}>hospital admission {index + 1}</Text>
      <Text>hospital name: {item.medicalUnitName}</Text>
      <Text>Doctor name:{item.createdBy}</Text>
      <Text>entry date:{item.date}</Text>
      <Text>entry time:{item.time}</Text>
    </View>
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
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#aed6f1", // Adjust the background color
    borderRadius: 12,
    padding: 16,
  },
});

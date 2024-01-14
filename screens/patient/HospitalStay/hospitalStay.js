import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { ref, get } from "firebase/database";
import { db } from "../../../firebase";
import styles from "../../../styles/patientStyles/hospitalStayStyle";

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
      } catch (error) {}
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
          Hospital name: {item.medicalUnitName}
        </Text>
        <Text style={styles.dateText}>Doctor name:{item.createdBy}</Text>
        <Text style={styles.dateText}>Entry date:{item.date}</Text>
        <Text style={styles.dateText}>Entry time:{item.time}</Text>
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

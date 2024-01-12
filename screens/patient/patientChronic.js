import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import styles from "../../styles/hospitalStyles/chronicStyles";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";

const PatientChronic = ({ route }) => {
  const { userId } = route.params;
  const [chronicIllnesses, setChronicIllnesses] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const presDataRef = ref(db, `users/patients/${userId}/Chronic`);
        const snapshot = await get(presDataRef);
        const loadedData = [];

        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const itemData = childSnapshot.val();
            itemData.id = childSnapshot.key;
            loadedData.push(itemData);
          });
          setChronicIllnesses(loadedData);
        }
      } catch (error) {}
    };
    loadData();
  }, [userId]);

  return (
    <View style={styles.container}>
      {chronicIllnesses.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No chronic Disease recorded for this patient.</Text>
        </View>
      ) : (
        <FlatList
          data={chronicIllnesses}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.chronicItem}>
              <View style={styles.row}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.textin}>{item.newChronic}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Hospital:</Text>
                <Text style={styles.textin}>{item.medicalUnitName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.textin}>{item.formattedDate}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default PatientChronic;

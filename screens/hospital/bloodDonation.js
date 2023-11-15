import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const BloodDonation = () => {
  const [lastDonationDate, setLastDonationDate] = useState(new Date());
  const [eligible, setEligible] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const checkEligibility = () => {
    const currentDate = new Date();
    const timeSinceLastDonation = currentDate - lastDonationDate;
    const minimumTimeBetweenDonations = 56 * 24 * 60 * 60 * 1000;

    if (timeSinceLastDonation < minimumTimeBetweenDonations) {
      setEligible(false);
    } else {
      setEligible(true);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Last Donation Date:</Text>
      <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={lastDonationDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setLastDonationDate(selectedDate);
            }
          }}
        />
      )}
      {lastDonationDate && (
        <Text>selectedDate:{lastDonationDate.toLocaleDateString()}</Text>
      )}

      <Button title="Check Eligibility" onPress={checkEligibility} />
      {eligible ? (
        <Text>You are eligible to donate blood.</Text>
      ) : (
        <Text>You are not eligible to donate blood yet.</Text>
      )}
    </View>
  );
};

export default BloodDonation;

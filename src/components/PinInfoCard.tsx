import React, { useState } from "react";
import { Text, Button, Card, Icon, Chip } from "react-native-elements";
import { ScrollView, StyleSheet, View } from "react-native";
import { Pin } from "../data/Pin";

function PinInfoCard(prop) {
  const [isVisible, setIsVisible] = useState(false);
  console.log("here is the object")
  console.log(prop.pin)
  const pin = prop.pin
  const navigation = prop.navigation
  return (
    <View style={styles.container}>
      <Text h4>{pin.details.title}</Text>
      <Text>{pin.details.slacklineLength}</Text>
      <Text>{pin.details.slacklineType}</Text>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <Chip title="Check In" containerStyle={{ marginRight: 10 }} />
        </View>
        <View style={styles.buttonContainer}>
          <Chip
            title="Reviews"
            type="outline"
            containerStyle={{ marginHorizontal: 10 }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Chip
            title="Photos"
            type="outline"
            containerStyle={{ marginHorizontal: 10 }}
            onPress={(e) => {

                    console.log("Check Pressed");
                    navigation.navigate("Spot Details", {
                      newPin: pin,
                    });
                  }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    margin: 10,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    // justifyContent: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    flex: 1,
  },
});

export default PinInfoCard;

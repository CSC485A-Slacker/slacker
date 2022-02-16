import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Input, Button, FAB } from "react-native-elements";

export const PinDetailsScreen = ({ route, navigation }) => {
  const [name, onChangeName] = useState("");
  const [type, onChangeType] = useState("");
  const [description, onChangeDescription] = useState("");
  const [length, onChangeLength] = useState("");

  const { newPin } = route.params;

  const onConfirmPress = () => {
    const confirmPin = {
      key: newPin.key,
      coordinate: {
        latitude: newPin.latitude,
        longitude: newPin.longitude
      },
      draggable: false,
      color: "red",
      title: name,
      description: description,
      type: type,
      length: length
    }
    navigation.navigate({
      name: 'Map',
      params: confirmPin
    })
  }

  return (
    <View style={styles.view}>
      <Text style={styles.text} h4>
        Enter Information
      </Text>
      <Input
        style={styles.input}
        placeholder="Name"
        onChangeText={(name) => onChangeName(name)}
        value={name}
      />
      <Input
        style={styles.input}
        placeholder="Description"
        onChangeText={(description) => onChangeDescription(description)}
        value={description}
      />
      <Input
        style={styles.input}
        placeholder="Slackline Type"
        onChangeText={(type) => onChangeType(type)}
        value={type}
      />

      <Input
        style={styles.input}
        placeholder="Distance (m)"
        onChangeText={(length) => onChangeLength(length)}
        value={length}
        errorStyle={{ color: "red" }}
        errorMessage="Enter a valid length"
      />
      <FAB
        visible={true}
        icon={{ name: "check", color: "white" }}
        color="blue"
        title='Confirm'
        onPress={onConfirmPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    margin: 10,
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  text: {
    padding: 50,
  },
  input: {
    fontSize: 14,
    padding: 10,
  },
});

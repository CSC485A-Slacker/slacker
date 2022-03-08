import { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Text, Input, FAB } from "react-native-elements";
import { useDispatch } from "react-redux";
import { Pin, updatePin } from "../../redux/PinSlice";

export const AddPinScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { newPin } = route.params;

  const [name, onChangeName] = useState("");
  const [type, onChangeType] = useState("");
  const [description, onChangeDescription] = useState("");
  const [length, onChangeLength] = useState("");

  const onConfirmPress = () => {
    const confirmPin: Pin = {
      key: newPin.key,
      coordinate: newPin.coordinate,
      draggable: false,
      color: "red",
      title: name,
      description: description,
      type: type,
      length: parseInt(length),
    };
    dispatch(updatePin(confirmPin));
    navigation.navigate({
      name: "Map",
      params: {
        confirmedPin: true,
      },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.view}>
        <Text style={styles.text} h4>
          Add Information
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
          keyboardType="number-pad"
        />
        <FAB
          containerStyle={{ margin: 20 }}
          visible={true}
          icon={{ name: "check", color: "white" }}
          color="#219f94"
          title="Confirm"
          onPress={onConfirmPress}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  view: {
    margin: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  text: {
    padding: 40,
    color: "#219f94",
  },
  input: {
    fontSize: 14,
    padding: 10,
  },
});

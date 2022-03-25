import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Text, Input, Button } from "react-native-elements";
import { useDispatch } from "react-redux";
import { removePin } from "../../redux/PinSlice";
import { Pin } from "../../data/Pin";
import { Database } from "../../data/Database";
import { pinConverter } from "../../data/DataConverters";
import { defaultColor } from "../../style/styles";

const database = new Database();

export const PinDetailsScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { newPin } = route.params;

  const [name, onChangeName] = useState("");
  const [description, onChangeDescription] = useState("");
  const [slacklineLength, onChangeLength] = useState("");
  const [slacklineType, onChangeType] = useState("");
  const [buttomDisabled, setButtomDisabled] = useState(true);

  useEffect(() => {
    if (name != "" &&  description != "" && slacklineType != "" && slacklineLength != "") {
      setButtomDisabled(false)
    }
  }, [name, description, slacklineType, slacklineLength])

  const onConfirmPress = async () => {
    const confirmPin: Pin = {
      key: newPin.key,
      coordinate: newPin.coordinate,
      details: {
        draggable: false,
        color: "red",
        title: name,
        description: description,
        slacklineType: slacklineType,
        slacklineLength: parseInt(slacklineLength),
      },
      reviews: [],
      photos: [],
      activity: {
        shareableSlackline: false,
        activeUsers: 0,
        totalUsers: 0,
      },
    };
    dispatch(removePin(confirmPin));
    navigation.navigate({
      name: "Map",
      params: {
        confirmedPin: true,
      },
    });
    try {
      const resp = await database.addPin(pinConverter.toFirestore(confirmPin));
      console.log(resp);
    } catch (error) {
      console.log(`error adding pin: ${error}`);
    }
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
          onChangeText={(slacklineType) => onChangeType(slacklineType)}
          value={slacklineType}
        />
        <Input
          style={styles.input}
          placeholder="Distance (m)"
          onChangeText={(slacklineLength) => onChangeLength(slacklineLength)}
          value={slacklineLength}
          keyboardType="number-pad"
        />
        <Button
          title="Submit"
          buttonStyle={{
            backgroundColor: defaultColor,
            borderWidth: 1,
            borderColor: "white",
            borderRadius: 30,
            padding: 10,
            width: 150,
          }}
          containerStyle={{
            margin: 15,
          }}
          icon={{ name: 'angle-double-right', type: 'font-awesome', size: 20, color: 'white' }}
          titleStyle={{ fontSize: 16}}
          onPress={onConfirmPress}
          disabled={buttomDisabled}
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
    color: defaultColor,
  },
  input: {
    fontSize: 14,
    padding: 10,
  },
});

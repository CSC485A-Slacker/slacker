import { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { Text, Icon, Slider, CheckBox, Button } from "react-native-elements";
import { useDispatch } from "react-redux";
import { Database } from "../../data/Database";
import { Pin, PinActivity } from "../../data/Pin";
import { updatePin } from "../../redux/PinSlice";
import { defaultColor, greyColor } from "../../style/styles";
const database = new Database();

export const CheckInDetailsScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();

  const { pinId, pinCoords, usr, pinTitle } = route.params;
  const [timeValue, setTimeValue] = useState(0);
  const [sharingSlackline, setSharingSlackline] = useState(false);
  const [notSharingSlackline, setNotSharingSlackline] = useState(false);
  const [noSlackline, setNoSlackline] = useState(false);

  const handleSharingSlackline = () => {
    console.log("Sharing Slackline");
    setSharingSlackline(!sharingSlackline);
  };

  const handleNotSharingSlackline = () => {
    console.log("Not Sharing Slackline");
    setNotSharingSlackline(!notSharingSlackline);
  };

  const handleNoSlackline = () => {
    console.log("No Slackline");
    setNoSlackline(!noSlackline);
  };

  const handleCancelPress = () => {
    navigation.navigate("Map");
  };

  const handleConfirmPress = () => {
    // can remove these logs when done debugging
    console.log(sharingSlackline);
    console.log(notSharingSlackline);
    console.log(noSlackline);
    console.log(timeValue);
    console.log(pinCoords);
    console.log(usr._userID);

    const dbPinPromise = database.getPin(pinCoords);
    dbPinPromise.then((result) => {
      const dbPin = result.data;
      if (dbPin) {
        try {
          const previousCheckinCoordinates = usr._checkInSpot;
          const changeCheckinSpotResult = database.ChangeCheckInSpot(
            usr._userID,
            pinCoords,
            timeValue
          );

          changeCheckinSpotResult.then((result) => {
            if (result.succeeded) {
              // update UI for previous pin (if checked out)
              if (previousCheckinCoordinates) {
                database.getPin(previousCheckinCoordinates).then((result) => {
                  const pin = result.data;
                  if (pin) {
                    dispatch(updatePin(pin));
                  }
                });
              }

              // update UI for newly checked in pin and navigate to
              database.getPin(pinCoords).then((result) => {
                const pin = result.data;
                if (pin) {
                  dispatch(updatePin(pin));
                  navigation.navigate("Map", { pin });
                }
              });
            } else {
              console.log(`${result.message}`);
              navigation.navigate("Map", { dbPin });
            }
          });

          // Still need to update UI with fire emoji or smthn
          // Still need to fix updating fresh map with details on navigation
        } catch (error) {
          console.log(`error updating pin activity: ${error}`);
          Alert.alert("Please try again");
        }
      }
      // should add an else throw err or something here
    });
  };

  const interpolate = (start: number, end: number) => {
    let k = (timeValue - 0) / 10; // 0 =>min  && 10 => MAX
    return Math.ceil((1 - k) * start + k * end) % 256;
  };

  const color = () => {
    let r = interpolate(10, 100);
    let g = interpolate(100, 200);
    let b = interpolate(0, 0);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.view}>
        <View style={styles.container}>
          <Text style={styles.title} h3>
            {" "}
            Going to {pinTitle}?
          </Text>
        </View>
        <Text style={styles.questionTitle}> How long are you staying?</Text>

        <View style={styles.contentView}>
          <Slider
            value={timeValue}
            onValueChange={setTimeValue}
            maximumValue={10}
            minimumValue={0}
            step={1}
            allowTouchTrack
            trackStyle={{ height: 5, backgroundColor: "black" }}
            thumbStyle={{
              height: 20,
              width: 20,
              backgroundColor: "transparent",
            }}
            thumbProps={{
              children: (
                <Icon
                  name="clock-o"
                  type="font-awesome"
                  size={20}
                  reverse
                  containerStyle={{ bottom: 20, right: 20 }}
                  color={color()}
                />
              ),
            }}
          />

          <Text style={{ paddingTop: 15, color: greyColor, fontSize: 12 }}>
            Duration: {timeValue} hours
          </Text>
        </View>
        <Text style={styles.questionTitle}>
          {" "}
          Are you bringing a slackline?{" "}
        </Text>

        <View style={styles.contentView}>
          <CheckBox
            title="Yes - I can share with others"
            checked={sharingSlackline}
            onPress={handleSharingSlackline}
            checkedColor={defaultColor}
          />
          <CheckBox
            title="Yes - I'm flying solo"
            checked={notSharingSlackline}
            onPress={handleNotSharingSlackline}
            checkedColor={defaultColor}
          />
          <CheckBox
            title="No"
            checked={noSlackline}
            onPress={handleNoSlackline}
            checkedColor={defaultColor}
          />
        </View>

        <View
          style={{
            padding: 20,
            width: "100%",
            justifyContent: "space-between",
            alignItems: "stretch",
            flexDirection: "row",
          }}
        >
          <Button
            title="Cancel"
            icon={{
              name: "ban",
              type: "font-awesome",
              size: 16,
              color: "white",
            }}
            iconRight
            iconContainerStyle={{ marginLeft: 10 }}
            titleStyle={{ fontWeight: "500", fontSize: 15 }}
            buttonStyle={{
              backgroundColor: defaultColor,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 30,
            }}
            containerStyle={{ width: "auto", flex: 1, padding: 10 }}
            onPress={handleCancelPress}
          />

          <Button
            title="Check-In"
            icon={{
              name: "angle-double-right",
              type: "font-awesome",
              size: 20,
              color: "white",
            }}
            iconRight
            iconContainerStyle={{ marginLeft: 10 }}
            titleStyle={{ fontWeight: "500", fontSize: 15 }}
            buttonStyle={{
              backgroundColor: defaultColor,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 30,
            }}
            containerStyle={{ width: "auto", flex: 1, padding: 10 }}
            onPress={handleConfirmPress}
          />
        </View>

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Icon
            name="info-circle"
            type="font-awesome"
            color={greyColor}
            size={30}
            underlayColor="clear"
            iconStyle={{ marginRight: 10 }}
          />

          <Text style={styles.subText}>
            Checking in lets others know someone is at this spot! {"\n"}But
            don't worry, your identity will not be made public.
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  view: {
    margin: 10,
    flex: 1,
    justifyContent: "flex-start",
  },
  container: {
    alignItems: "center",
  },
  title: {
    padding: 40,
    paddingBottom: 20,
    color: defaultColor,
    textAlign: "center",
  },
  questionTitle: {
    padding: 10,
    fontSize: 20,
    color: greyColor,
  },
  text: {
    padding: 50,
    paddingLeft: 60,
    color: defaultColor,
  },
  subText: {
    textAlign: "justify",
    fontSize: 12,
    color: greyColor,
  },
  input: {
    fontSize: 14,
    padding: 10,
  },
  contentView: {
    padding: 20,
    paddingTop: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "stretch",
  },
  questionText: {
    paddingTop: 10,
    color: "#696969",
  },
});

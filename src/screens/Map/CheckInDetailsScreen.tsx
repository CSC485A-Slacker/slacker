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

const database = new Database();

export const CheckInDetailsScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();

  const { pinId } = route.params;
  const [timeValue, setTimeValue] = useState(0);
  const [sharingSlackline, setSharingSlackline] = useState(false);
  const [notSharingSlackline, setNotSharingSlackline] = useState(false);
  const [noSlackline, setNoSlackline] = useState(false);

  const handleSharingSlackline = () => {
    console.log("Sharing Slackline")
    setSharingSlackline(!sharingSlackline)
  }

  const handleNotSharingSlackline = () => {
    console.log("Not Sharing Slackline")
    setNotSharingSlackline(!notSharingSlackline)
  }

  const handleNoSlackline = () => {
    console.log("No Slackline")
    setNoSlackline(!noSlackline)
  }

  const handleCancelPress = () => {
    navigation.navigate('Map')
  }

  const handleConfirmPress = () => {
    console.log(sharingSlackline)
    console.log(notSharingSlackline)
    console.log(noSlackline)
    console.log(timeValue)
    console.log(pinId)
  }

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
        <Text style={styles.text} h3> Going to this spot?</Text>

        <Text style={styles.questionText} h4> How long are you staying? </Text>

        <View style={styles.contentView}>
          <Slider
            value={timeValue}
            onValueChange={setTimeValue}
            maximumValue={10}
            minimumValue={0}
            step={1}
            allowTouchTrack
            trackStyle={{ height: 5, backgroundColor: 'black' }}
            thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
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

          <Text style={{ paddingTop: 15, color: "#696969" }}>Duration: {timeValue} hours</Text>
        </View>
          <Text style={styles.questionText} h4> Are you bringing a slackline? </Text>
          
          <View style={styles.contentView}>
            <CheckBox
              title="Yes - I can share with others"
              checked={sharingSlackline}
              onPress={handleSharingSlackline}
            />
            <CheckBox
              title="Yes - I'm flying solo"
              checked={notSharingSlackline}
              onPress={handleNotSharingSlackline}
            />
            <CheckBox
              title="No"
              checked={noSlackline}
              onPress={handleNoSlackline}
            />
          </View>

          <View style={{ padding: 20, width: '100%', justifyContent: 'space-between', alignItems: 'stretch', flexDirection: 'row' }}>
            <Button 
              title="Cancel"
              icon={{ name: 'ban', type: 'font-awesome', size: 16, color: 'white' }}
              iconRight
              iconContainerStyle={{ marginLeft: 10 }}
              titleStyle={{ fontWeight: '500', fontSize: 15 }}
              buttonStyle={{ backgroundColor: 'rgba(4, 147, 114, 1)', borderColor: 'transparent', borderWidth: 0, borderRadius: 30 }}
              containerStyle={{ width: "auto", flex: 1, padding: 10 }}
              onPress={handleCancelPress}
            />

            <Button 
              title="Check-In"
              icon={{ name: 'angle-double-right', type: 'font-awesome', size: 20, color: 'white' }}
              iconRight
              iconContainerStyle={{ marginLeft: 10 }}
              titleStyle={{ fontWeight: '500', fontSize: 15 }}
              buttonStyle={{ backgroundColor: 'rgba(4, 147, 114, 1)', borderColor: 'transparent', borderWidth: 0, borderRadius: 30 }}
              containerStyle={{ width: "auto", flex: 1, padding: 10 }}
              onPress={handleConfirmPress}
            />
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <Icon
              name="info-circle"
              type="font-awesome"
              color={"#696969"}
              size={30}
              underlayColor="clear"
              iconStyle={{marginRight: 5, paddingTop: 15}}
            />
            
            <Text style={{ paddingTop: 15, color: "#696969", textAlign: "center"}}> 
              Checking in lets others know someone is at this spot! {'\n'}But don't worry, your identity will not be made public.
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
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  text: {
    padding: 50,
    paddingLeft: 70,
    color: "#219f94",
  },
  input: {
    fontSize: 14,
    padding: 10,
  },
  contentView: {
    padding: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  questionText: {
    textAlign: "left",
    paddingTop: 10,
    color: "#696969",
  }
});

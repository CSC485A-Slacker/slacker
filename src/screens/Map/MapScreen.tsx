import { useState } from "react";
import MapView from "react-native-maps";
import {
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Marker } from "react-native-maps";
import { FAB } from "react-native-elements";

const victoriaMarker = {
  latitude: 48.458494,
  longitude: -123.295260,
};


let id = 0;
const victoriaPin = {
  key: 123,
  coordinate: victoriaMarker,
  color: "red",
  draggable: false,
  title: "Quad Liner",
  description: "Its pretty cool",
};

let regionLatitude = 48.463708
let regionLongitude = -123.311406


let newPin = {
  key: id++,
  coordinate: {
    latitude: regionLatitude,
    longitude: regionLatitude
  },
  draggable: true,
  color: "blue"
};

export const MapScreen = ({ navigation }) => {

  // Used to keep track of button visibility and pins
  const [addPinVisble, setAddPinVisible] = useState(true);
  const [confirmCancelVisible, setConfirmCancelVisible] = useState(false);
  const [pins, setPins] = useState([victoriaPin]);


  // Whenever the user moves the map, we update center coordinates
  const updateRegion = (e: any) => {
    regionLatitude = e.latitude
    regionLongitude = e.longitude
  }

  // Add a pin to the center of the map
  const handleAddPin = () => {
    const newPins = [...pins];
    newPin = {
      key: id++,
      coordinate: {
        latitude: regionLatitude,
        longitude: regionLongitude
      },
      draggable: true,
      color: "blue",
    };
    newPins.push(newPin);
    setPins(newPins);
    setAddPinVisible(false)
    setConfirmCancelVisible(true);
  };

  const handleConfirmPress = () => {
    setConfirmCancelVisible(false)
    setAddPinVisible(true);
    navigation.navigate('Spot Details', {
          newPin: newPin
        })
  };

  // Remove pin from map
  const handleCancelPress = () => {
    const newPins = [...pins];
    const updatedPins = newPins.filter((pin) => pin.key != newPin.key);
    setPins(updatedPins);
    setConfirmCancelVisible(false);
    setAddPinVisible(true);
  };


  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 48.463708,
          latitudeDelta: 0.1,
          longitude: -123.311406,
          longitudeDelta: 0.1,
        }}
        onRegionChangeComplete={e => updateRegion(e)}
      >
        {pins.map((pin) => (
          <Marker
            key={pin.key}
            coordinate={pin.coordinate}
            pinColor={pin.color}
            draggable={pin.draggable}
            onDragEnd={e => console.log(e.nativeEvent)}
          ></Marker>
        ))}
      </MapView>
      <FAB
        visible={addPinVisble}
        icon={{ name: "add", color: "white" }}
        color="green"
        onPress={handleAddPin}
        placement="right"
      />
      <FAB
        title="Add Pin"
        visible={confirmCancelVisible}
        icon={{ name: "add", color: "white" }}
        color="blue"
        onPress={handleConfirmPress }
        placement="left"
      />
      <FAB
        titleStyle={{ color: 'blue' }}
        title="Cancel"
        visible={confirmCancelVisible}
        icon={{ name: "close", color: "blue" }}
        color="white"
        onPress={handleCancelPress}
        placement="right"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    zIndex: -1,
  },
  cancelButton: {
    color: "blue"
  }
});

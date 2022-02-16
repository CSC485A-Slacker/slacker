import { useEffect, useState } from "react";
import MapView, { LatLng } from "react-native-maps";
import { View, StyleSheet, Dimensions } from "react-native";
import { Marker, Callout } from "react-native-maps";
import { FAB, Text } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import {
  addPin,
  generateRandomKey,
  Pin,
  removePin,
} from "../../redux/PinSlice";

// The middle point of the current map display
let regionLatitude = 48.463708;
let regionLongitude = -123.311406;

// New pin to be modified
let newPin: Pin = {
  key: generateRandomKey(),
  coordinate: {
    latitude: regionLatitude,
    longitude: regionLongitude,
  },
  color: "blue",
  draggable: true,
  title: "",
  length: 0,
  type: "",
  description: "",
};

export const MapScreen = ({ route, navigation }) => {
  const pins = useSelector((state: RootState) => state.pins.pins);
  const dispatch = useDispatch();

  const [addPinVisible, setAddPinVisible] = useState(true);
  const [confirmCancelVisible, setConfirmCancelVisible] = useState(false);

  // If pin was added, reset to original view
  useEffect(() => {
    if (route.params?.confirmedPin) {
      setAddPinVisible(true);
      setConfirmCancelVisible(false);
      route.params.confirmedPin = false;
    }
  });

  // Keeps track of the map region
  const updateRegion = (e: LatLng) => {
    regionLatitude = e.latitude;
    regionLongitude = e.longitude;
  };

  const handleAddPin = () => {
    newPin = {
      key: generateRandomKey(),
      coordinate: {
        latitude: regionLatitude,
        longitude: regionLongitude,
      },
      color: "blue",
      draggable: true,
      title: "",
      length: 0,
      type: "",
      description: "",
    };
    dispatch(addPin(newPin));
    setAddPinVisible(false);
    setConfirmCancelVisible(true);
  };

  const handleConfirmPress = () => {
    navigation.navigate("Spot Details", {
      newPin: newPin,
    });
  };

  const handleCancelPress = () => {
    dispatch(removePin(newPin));
    setConfirmCancelVisible(false);
    setAddPinVisible(true);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: regionLatitude,
          latitudeDelta: 0.1,
          longitude: regionLongitude,
          longitudeDelta: 0.1,
        }}
        onRegionChangeComplete={(e) => updateRegion(e)}
      >
        {pins.map((pin) => (
          <Marker
            key={pin.key}
            coordinate={pin.coordinate}
            pinColor={pin.color}
            draggable={pin.draggable}
          >
            {pin.title ? (
              <Callout style={styles.callout}>
                <View>
                  <Text style={styles.title}>{pin.title}</Text>
                  <Text style={styles.description}>{pin.description}</Text>
                  <Text>{pin.type}</Text>
                  <Text style={styles.text}>{pin.length + "m"}</Text>
                </View>
              </Callout>
            ) : null}
          </Marker>
        ))}
      </MapView>
      {confirmCancelVisible ? (
        <FAB
          title="Add Pin"
          icon={{ name: "add", color: "white" }}
          color="#219f94"
          onPress={handleConfirmPress}
          placement="right"
        />
      ) : null}
      {confirmCancelVisible ? (
        <FAB
          titleStyle={{ color: "#219f94" }}
          title="Cancel"
          icon={{ name: "close", color: "#219f94" }}
          color="white"
          onPress={handleCancelPress}
          placement="left"
        />
      ) : null}
      {addPinVisible ? (
        <FAB
          visible={addPinVisible}
          icon={{ name: "add", color: "white" }}
          color="#219f94"
          onPress={handleAddPin}
          placement="right"
        />
      ) : null}
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
  callout: {
    maxWidth: 200,
  },
  title: {
    fontSize: 20,
    color: "#219f94",
    paddingBottom: 2,
  },
  text: {
    paddingBottom: 5,
  },
  description: {
    fontSize: 10,
    paddingBottom: 7,
  },
});

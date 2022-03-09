import { useEffect, useState } from "react";
import MapView, { LatLng } from "react-native-maps";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import { Marker, Callout } from "react-native-maps";
import { FAB, Text, Chip } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { addPin, generateRandomKey, removePin } from "../../redux/PinSlice";
import PinInfoOverlay from "../../components/PinInfoOverlay";
import BottomDrawer from "react-native-bottom-drawer-view";
import { Pin } from "../../data/Pin";
import SlidingUpPanel from 'rn-sliding-up-panel';


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
  details: {
    title: "",
    description: "",
    slacklineLength: 0,
    slacklineType: "",
    color: "blue",
    draggable: true,
  },
  reviews: [],
  photos: [],
  activity: {
    checkIn: false,
    activeUsers: 0,
    totalUsers: 0,
  },
};

export const MapScreen = ({ route, navigation }) => {
  const pins = useSelector((state: RootState) => state.pins.pins);
  const dispatch = useDispatch();

  const [addPinVisible, setAddPinVisible] = useState(true);
  const [confirmCancelVisible, setConfirmCancelVisible] = useState(false);
  const [pinInfoVisible, setPinInfoVisible] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: regionLatitude,
    longitude: regionLongitude,
  });
  const [selectedPin, setSelectedPin] = useState(pins[0]);

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
      details: {
        color: "blue",
        draggable: true,
        title: "",
        description: "",
        slacklineLength: 0,
        slacklineType: "",
      },
      reviews: [],
      photos: [],
      activity: {
        checkIn: false,
        activeUsers: 0,
        totalUsers: 0,
      },
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

  const handlePinPress = (e, pin: Pin) => {
    // check first if pin is saved
    e.stopPropagation();
    setPinInfoVisible(true);
    setSelectedPin((selectedPin) => ({
      ...selectedPin,
      ...pin,
    }));
  };

  const updateMap = (e: LatLng) => {
    setMapRegion(e);
  };


  function onMapPress(): void {
    setPinInfoVisible(false);
  }

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
        provider={"google"}
        showsPointsOfInterest={false}
        onMarkerPress={(e) => updateMap(e.nativeEvent.coordinate)}
        onPress={onMapPress}
      >
        {pins.map((pin) => (
          <Marker
            key={pin.key}
            coordinate={pin.coordinate}
            pinColor={pin.details.color}
            draggable={pin.details.draggable}
            onPress={(e) => {
              if (
                e.nativeEvent.action === "marker-inside-overlay-press" ||
                e.nativeEvent.action === "callout-inside-press"
              ) {
                return;
              }

              console.log("Pin Pressed");
              handlePinPress(e, pin);
            }}
          ></Marker>
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
          icon={{ name: "add", color: "white" }}
          color="#219f94"
          onPress={handleAddPin}
          placement="right"
        />
      ) : null}
      {pinInfoVisible ? (
        <PinInfoOverlay
          pin={{ ...selectedPin }}
          navigation={navigation}
        ></PinInfoOverlay>
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
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  callout: {
    flex: 1,
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
  infoContainer: {
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

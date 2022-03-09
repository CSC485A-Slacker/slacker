import { useEffect, useState } from "react";
import MapView, { CalloutSubview, LatLng } from "react-native-maps";
import { View, StyleSheet, Dimensions } from "react-native";
import { Marker, Callout } from "react-native-maps";
import { FAB, Text } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import {
  addPin,
  generateRandomKey,
  removePin,
  updatePin,
} from "../../redux/PinSlice";
import { Pin } from "../../data/Pin";
import { Database} from "../../data/Database";
import { collection, getFirestore, onSnapshot, query } from "@firebase/firestore";
import { firebaseApp } from "../../config/FirebaseConfig";
import { pinConverter } from "../../data/DataConverters";
import { Button } from "react-native-elements/dist/buttons/Button";

const database = new Database();

// Keeps track of the middle point of the current map display
let regionLatitude = 48.463708;
let regionLongitude = -123.311406;

// Keep track of the new pin lat and long
let newPinLatitude = regionLatitude;
let newPinLongitude = regionLongitude;

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
    totalUsers:  0,
  }
};

export const MapScreen = ({ route, navigation }) => {
  const pins = useSelector((state: RootState) => state.pins.pins);
  const dispatch = useDispatch();

  const [addPinVisible, setAddPinVisible] = useState(true);
  const [confirmCancelVisible, setConfirmCancelVisible] = useState(false);

  const db = getFirestore(firebaseApp);
  const q = query(collection(db, "pins"))

  useEffect( () => { 
    const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        
      const pin = pinConverter.fromFirestore(change.doc)
        //console.log(`PIN COOR: ${pin.coordinate.latitude} ${pin.coordinate.longitude}`)
            if(change.type === "added") {
                dispatch(addPin(pin));
            }
            else if(change.type === "modified") {
                dispatch(updatePin(pin));
            } else if(change.type === "removed") {
                dispatch(removePin(pin));
            }
    });
  }); }, [] )
  

  // If pin was added, reset to original view
  useEffect(() => {
    if (route.params?.confirmedPin) {
      setAddPinVisible(true);
      setConfirmCancelVisible(false);
      route.params.confirmedPin = false;
    }
  });

  // Keeps track of the map region
  const updateRegionCoordinates = (e: LatLng) => {
    regionLatitude = e.latitude;
    regionLongitude = e.longitude;
  };

  // Keeps track of the map region
  const updateNewPinCoordinates = (e: LatLng) => {
    newPinLatitude = e.latitude;
    newPinLongitude = e.longitude;
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
        totalUsers:  0,
       }
    };
    newPinLatitude = regionLatitude;
    newPinLongitude = regionLongitude;
    dispatch(addPin(newPin));
    setAddPinVisible(false);
    setConfirmCancelVisible(true);
  };

  const handleConfirmPress = () => {
    const pinToAdd = {
      key: newPin.key,
      coordinate: {
        latitude: newPinLatitude,
        longitude: newPinLongitude,
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
        totalUsers:  0,
       }
    };
    navigation.navigate("Spot Details", {
      newPin: pinToAdd,
    });
  };

  const handleCancelPress = () => {
    dispatch(removePin(newPin));
    setConfirmCancelVisible(false);
    setAddPinVisible(true);
  };

  const handleCheckIn = (pinId: number) => {
    navigation.navigate("Check-In Details", {pinId})
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
        onRegionChangeComplete={(e) => updateRegionCoordinates(e)}
        provider={"google"}
      >
        {pins.map((pin) => (
          
          <Marker
            key={pin.key}
            coordinate={pin.coordinate}
            pinColor={pin.details.color}
            draggable={pin.details.draggable}
            onDragEnd={(e) => updateNewPinCoordinates(e.nativeEvent.coordinate)}
          >
            {pin.details.title ? (
              <Callout style={styles.callout} tooltip={true}>
                <View>
                  <Text style={styles.title}>{pin.details.title}</Text>
                  <Text style={styles.description}>{pin.details.description}</Text>
                  <Text>{pin.details.slacklineType}</Text>
                  <Text style={styles.text}>{pin.details.slacklineLength + "m"}</Text>
                  <CalloutSubview onPress={() => handleCheckIn(pin.key)}>
                    <Button 
                      title="Check-In"
                      icon={{ name: 'angle-double-right', type: 'font-awesome', size: 20, color: 'white' }}
                      iconRight
                      iconContainerStyle={{ marginLeft: 10 }}
                      titleStyle={{ fontWeight: '500', fontSize: 12 }}
                      buttonStyle={{ backgroundColor: 'rgba(4, 147, 114, 1)', borderColor: 'transparent', borderWidth: 0, borderRadius: 30 }}
                      containerStyle={{ width: "auto", flex: 1, padding: 10 }}
                    />
                </CalloutSubview>
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
    paddingHorizontal: 5,
    paddingVertical: 5,
    maxWidth: 300,
    backgroundColor: "#fff",
    justifyContent: "center",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 25,
  },
  title: {
    fontSize: 20,
    color: "#219f94",
    paddingBottom: 2,
    paddingTop: 2,
    paddingHorizontal: 5,
  },
  text: {
    paddingBottom: 5,
  },
  description: {
    fontSize: 10,
    paddingBottom: 7,
  },
});

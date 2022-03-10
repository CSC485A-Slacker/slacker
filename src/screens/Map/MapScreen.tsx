import { useEffect, useState } from "react";
import MapView, { LatLng } from "react-native-maps";
import { View, StyleSheet, Dimensions } from "react-native";
import { Marker, Callout } from "react-native-maps";
import { FAB, Text } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../../redux/Store";
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

const defaultColor:string = "#219f94";
const hotColor:string = "#D2042D";

export const MapScreen = ({ route, navigation }: any) => {
  const pins = useSelector((state: RootState) => state.pins.pins);
  const dispatch = useDispatch();

  const [addPinVisible, setAddPinVisible] = useState(true);
  const [confirmCancelVisible, setConfirmCancelVisible] = useState(false);

  const [hotspotToggleVisible, setHotSpotToggleVisible] = useState(true);
  const [hotspotToggleColor, setHotspotToggleColor] = useState(defaultColor);
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
      setHotSpotToggleVisible(true)
      setConfirmCancelVisible(false);
      route.params.confirmedPin = false;
    }
  }, [addPinVisible]);


  // effect hook for when the hotspot toggle button changes visibility
  // this might not be necessary, consider deleting later
  useEffect(() => {
    
  }, [hotspotToggleVisible]);


  // change color of hotspot toggle button and show appropriate pins
  // button is red -> only pins with people currently checked in
  // button is aqua -> all pins
  const handleHotspotToggle = () => {
    let newColor:string = defaultColor;
    if(hotspotToggleColor == defaultColor) newColor = hotColor;
    setHotspotToggleColor(newColor);

    // TODO: decide whether to show all pins or only pins
    // with people currently checked in there
  }

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
    setHotSpotToggleVisible(false);
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
    setAddPinVisible(true);
    setConfirmCancelVisible(false);
    navigation.navigate("Spot Details", {
      newPin: pinToAdd,
    });
  };

  const handleCancelPress = () => {
    dispatch(removePin(newPin));
    setConfirmCancelVisible(false);
    setAddPinVisible(true);
    setHotSpotToggleVisible(true);
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
              <Callout style={styles.callout}>
                <View>
                  <Text style={styles.title}>{pin.details.title}</Text>
                  <Text style={styles.description}>{pin.details.description}</Text>
                  <Text>{pin.details.slacklineType}</Text>
                  <Text style={styles.text}>{pin.details.slacklineLength + "m"}</Text>
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
          color={defaultColor}
          onPress={handleConfirmPress}
          placement="right"
        />
      ) : null}
      {confirmCancelVisible ? (
        <FAB
          titleStyle={{ color: defaultColor}}
          title="Cancel"
          icon={{ name: "close", color: defaultColor}}
          color="white"
          onPress={handleCancelPress}
          placement="left"
        />
      ) : null}
      {addPinVisible ? (
        <>
        {hotspotToggleVisible? (
          <FAB
            icon={{ name: "whatshot", color: "white" }}
            style={{ paddingBottom: 65 }} // ensure the button doesn't overlap with the one below it
            color={hotspotToggleColor}
            onPress={handleHotspotToggle}
            placement="right"
          />
        ) : null}
        <FAB
          icon={{ name: "add", color: "white" }}
          color={defaultColor}
          onPress={handleAddPin}
          placement="right"
        />
        </>
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
    color:defaultColor,
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

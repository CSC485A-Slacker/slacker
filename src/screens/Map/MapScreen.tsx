import { useEffect, useState } from "react";
import MapView, { LatLng } from "react-native-maps";
import { View, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import { FAB } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import {
  addPin,
  generateRandomKey,
  removePin,
  updatePin,
} from "../../redux/PinSlice";
import { Pin } from "../../data/Pin";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
} from "@firebase/firestore";
import { auth, firebaseApp } from "../../config/FirebaseConfig";
import { Database } from "../../data/Database";
import { pinConverter } from "../../data/DataConverters";
import PinInfoOverlay from "../../components/PinInfoOverlay";
import { defaultColor, hotColor } from "../../style/styles";
import { useToast } from "react-native-toast-notifications";

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
    color: "green",
    draggable: true,
  },
  reviews: [],
  photos: [],
  activity: {
    shareableSlackline: false,
    activeUsers: 0,
    totalUsers: 0,
    checkedInUserIds: [],
  },
  privateViewers: [],
  favoriteUsers: [],
};

export const MapScreen = ({ route, navigation }: any) => {
  const pins = useSelector((state: RootState) => state.pins.pins);
  const dispatch = useDispatch();
  const user = auth.currentUser;

  const [addPinVisible, setAddPinVisible] = useState(true);
  const [confirmCancelVisible, setConfirmCancelVisible] = useState(false);
  const [pinInfoVisible, setPinInfoVisible] = useState(false);
  const [selectedPin, setSelectedPin] = useState(pins[0]);

  const [hotspotToggleVisible, setHotSpotToggleVisible] = useState(true);
  const [hotspotToggleColor, setHotspotToggleColor] = useState(defaultColor);
  const db = getFirestore(firebaseApp);
  const q = query(collection(db, "pins"));

  const toast = useToast(); // toast notifications

  // navigate to login screen if user is not logged in
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigation.navigate("Login");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const pin = pinConverter.fromFirestore(change.doc);
        if (change.type === "added") {
          dispatch(addPin(pin));
        } else if (change.type === "modified") {
          dispatch(removePin(pin))  
          dispatch(addPin(pin));
        //   dispatch(updatePin(pin));
        } else if (change.type === "removed") {
          dispatch(removePin(pin));
        }
      });
    });
  }, []);

  // If pin was added, reset to original view
  useEffect(() => {
    if (route.params?.confirmedPin) {
      setAddPinVisible(true);
      setHotSpotToggleVisible(true);
      setConfirmCancelVisible(false);
      route.params.confirmedPin = false;
      toast.show("Pin added successfuly!", {
        type: "success",
      });
    }
  });

  // change color of hotspot toggle button and show appropriate pins
  // button is red -> only pins with people currently checked in
  // button is aqua -> all pins
  const handleHotspotToggle = () => {
    let newColor: string = defaultColor;
    if (hotspotToggleColor == defaultColor) newColor = hotColor;
    setHotspotToggleColor(newColor);
  };

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
        color: "green",
        draggable: true,
        title: "",
        description: "",
        slacklineLength: 0,
        slacklineType: "",
      },
      reviews: [],
      photos: [],
      activity: {
        shareableSlackline: false,
        activeUsers: 0,
        totalUsers: 0,
        checkedInUserIds: [],
      },
      privateViewers: [],
      favoriteUsers: [],
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
        color: "green",
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
        checkedInUserIds: [],
      },
    };
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

  const handlePinPress = (e, pin: Pin) => {
    if (pin.details.title != "") {
      e.stopPropagation();
      setHotSpotToggleVisible(false);
      setAddPinVisible(false);
      setPinInfoVisible(true);
      setSelectedPin((selectedPin) => ({
        ...selectedPin,
        ...pin,
      }));
    }
  };

  const onMapPress = () => {
    setPinInfoVisible(false);
    setSelectedPin(null);
    setHotSpotToggleVisible(true);
    setAddPinVisible(true);
  };

  // Filter out any pins that shouldn't be visible to the current user
  // this means any pins that were created as private by other people
  // that the current user does not have permission to view
  // keeps any publicly available pins as well as any private
  // pins the user has permission to view

  let pinsToRender: Pin[] = pins.filter(
    (pin: Pin) =>
      pin.privateViewers?.length == 0 ||
      !pin.privateViewers ||
      pin.privateViewers.indexOf(auth.currentUser?.uid || "") > -1
  );

  pinsToRender.forEach(pin => {
    if(user && pin.favoriteUsers.includes(user.uid)) pin.details.color = "purple"
  })

  if (hotspotToggleColor == hotColor)
    pinsToRender = pinsToRender.filter((pin) => pin.activity.activeUsers > 0);

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
        showsPointsOfInterest={false}
        onMarkerPress={(e) => updateRegionCoordinates(e.nativeEvent.coordinate)}
        onPress={onMapPress}
      >
        {pinsToRender.map((pin) => (
          <Marker
            key={pin.key}
            coordinate={pin.coordinate}
            pinColor={pin.details.color}
            image={
              pin.activity.activeUsers
                ? require("../../assets/flame1.png")
                : null
            }
            draggable={pin.details.draggable}
            onDragEnd={(e) => updateNewPinCoordinates(e.nativeEvent.coordinate)}
            onPress={(e) => {
              handlePinPress(e, pin);
            }}
          ></Marker>
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
          titleStyle={{ color: defaultColor }}
          title="Cancel"
          icon={{ name: "close", color: defaultColor }}
          color="white"
          onPress={handleCancelPress}
          placement="left"
        />
      ) : null}
      {addPinVisible ? (
        <>
          {hotspotToggleVisible ? (
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
});

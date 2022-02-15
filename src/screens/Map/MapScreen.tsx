import { useState } from "react";
import MapView from "react-native-maps";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { Marker } from "react-native-maps";
import { Fab, Icon } from "native-base";
import { AntDesign } from "@expo/vector-icons";


const victoriaMarker = {
  latitude: 48.463708,
  longitude: -123.311406,
};

const otherMarker = {
  latitude: 48.468708,
  longitude: -123.318406,
};

let id = 0;
const victoriaPin = {
  key: 123,
  coordinate: victoriaMarker,
  color: "red",
  draggable: false,
  title: "Quad Liner",
  description: "Its pretty cool"
};

let newPin = {
  key: id++,
  coordinate: otherMarker,
  draggable: true,
  color: "blue", // Change to whatever we want
};

export const MapScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [addPinVisble, setAddPinVisible] = useState(true);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [slacklineLength, onChangeLength] = useState(null);
  const [slacklineType, onChangeType] = useState(null);
  const [locationDescription, onChangeDescription] = useState(null);

  // Used to keep track of the pins
  const [pins, setPins] = useState([victoriaPin]);

  const handleAdd = () => {
    const newPins = [...pins];
    console.log("I clicked a pin!");
    newPin = {
      key: id++,
      coordinate: otherMarker,
      draggable: true,
      color: "blue", // Change to whatever we want
    };
    newPins.push(newPin);
    console.log(newPins);
    setPins(newPins);
    setButtonVisible(true);
  };

  const onMapPress = (e: any) => {
    console.log(e.nativeEvent.coordinate);
  };

  const handleCancel = () => {
    const newPins = [...pins];
    console.log("Remove a pin");
    const updatedPins = newPins.filter((pin) => pin.key != newPin.key);
    console.log(updatedPins);
    setPins(updatedPins);
    setButtonVisible(false);
    setAddPinVisible(true)
    setModalVisible(false)
  };

  const handleAddPin = () => {
    console.log("Add new pin to list")
    console.log(locationDescription)
    onChangeDescription(locationDescription)
    onChangeLength(slacklineLength)
    onChangeType(slacklineType)
    const newPins = [...pins];
    const addPin = {
      key: newPin.key,
      coordinate: newPin.coordinate,
      draggable: false,
      color: "red",
      title: slacklineType,
      description: locationDescription
    }
    const updatedPins = newPins.filter((pin) => pin.key != newPin.key);
    updatedPins.push(addPin)
    setPins(updatedPins);
    console.log(pins)
    setButtonVisible(false);
    setModalVisible(false)
    setAddPinVisible(true)
  }

  const handleConfirm = () => {
    setButtonVisible(false);
    setModalVisible(true)
    setAddPinVisible(false)
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {addPinVisble ? (
        <Fab
          renderInPortal={false}
          shadow={2}
          size="sm"
          onPress={handleAdd}
          icon={<Icon color="white" as={AntDesign} name="plus" size="sm" />}
        />
      ) : null}
      {buttonVisible ? (
        <Fab
          renderInPortal={false}
          shadow={2}
          size="sm"
          onPress={handleConfirm}
          placement="bottom-left"
          icon={<Icon color="white" as={AntDesign} name="check" size="sm" />}
          label="Confirm"
        />
      ) : null}
      {buttonVisible ? (
        <Fab
          renderInPortal={false}
          shadow={2}
          size="sm"
          onPress={handleCancel}
          placement="bottom-right"
          icon={<Icon color="white" as={AntDesign} name="close" size="sm" />}
          label="Cancel"
        />
      ) : null}

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 48.463708,
          latitudeDelta: 0.1,
          longitude: -123.311406,
          longitudeDelta: 0.1,
        }}
      >
        {pins.map((pin) => (
          <Marker
            key={pin.key}
            coordinate={pin.coordinate}
            pinColor={pin.color}
            draggable={pin.draggable}
            title={pin.title}
            description={pin.description}
          ></Marker>
        ))}
      </MapView>
      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Saved new location, thanks!");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Enter new location details</Text>
              <TextInput
                style={styles.input}
                placeholder="Slackline Length"
                onChangeLength={onChangeLength}
                value={slacklineLength}
              />
              <TextInput
                style={styles.input}
                placeholder="Slackline Type"
                onChangeType={onChangeType}
                value={slacklineType}
              />
              <TextInput
                style={styles.input}
                placeholder="Location Description"
                onChangeDescription={onChangeDescription}
                value={locationDescription}
              />
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={handleAddPin}
              >
                <Text style={styles.textStyle}>Confirm</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={handleCancel}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
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
  cancelFab: {
    backgroundColor: "purple",
  },
  overlay: {
    position: "absolute",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    zIndex: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    marginVertical: 10,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#2196F3",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
  },
  buttonBox: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

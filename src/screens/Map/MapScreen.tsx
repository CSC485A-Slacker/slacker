import React, { useState } from "react";
import MapView from 'react-native-maps';
import {View, StyleSheet, Dimensions } from 'react-native';
import { Marker } from 'react-native-maps';
import { Fab, Icon} from "native-base";
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
  draggable: false  
}



export const MapScreen= () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [addPinVisble, setAddPinVisible] = useState(true);

  // Used to keep track of the pins 
  const [pins, setPins] = useState([victoriaPin]);

  const handleAdd = () => {
    const newPins = [...pins];
    console.log("I clicked a pin!")
    const newPin = {
      key: id++,
      coordinate: otherMarker,
      draggable: true,
      color: 'blue'  // Change to whatever we want
    }
    newPins.push(newPin);
    console.log(newPins)
    setPins(newPins);
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      
      <Fab style={styles.fab} renderInPortal={false} shadow={2} size="sm" onPress={handleAdd}
       icon={<Icon color="white" as={AntDesign} name="plus" size="sm" />} 
       />
       <MapView 
        style={styles.map}
        initialRegion={{
          latitude: 48.463708,
          latitudeDelta: 0.1,
          longitude: -123.311406,
          longitudeDelta: 0.1,
        }}
      >
        {
          pins.map(pin => (
            <Marker
            key={pin.key}
            coordinate={pin.coordinate}
            pinColor = {pin.color}
            draggable = {pin.draggable}
            />
          ))}
           
        </MapView>
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  
    
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: -1
  },
  fab: {
    zIndex: 10
  }
});
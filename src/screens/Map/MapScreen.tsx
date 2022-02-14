import MapView from 'react-native-maps';
import {View, StyleSheet, Dimensions } from 'react-native';
import { Marker } from 'react-native-maps';
import { Fab, Icon} from "native-base";
import { AntDesign } from "@expo/vector-icons";



const victoriaMarker = {
  latitude: 48.463708,
  longitude: -123.311406,
};

export const MapScreen= () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
       <Fab renderInPortal={false} shadow={2} size="sm" icon={<Icon color="white" as={AntDesign} name="plus" size="sm" />} />
      <MapView 
      style={styles.map}
      initialRegion={{
        latitude: 48.463708,
        latitudeDelta: 0.1,
        longitude: -123.311406,
        longitudeDelta: 0.1,
      }}
      >
        <Marker coordinate={victoriaMarker} draggable></Marker>
       
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
  },
});
import MapView from 'react-native-maps';
import {View, StyleSheet, Dimensions } from 'react-native';
import { Marker } from 'react-native-maps';

const exampleMarker = {
  latitude: 48.463708,
  longitude: -123.311406,
};

export const MapScreen= () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <MapView style={styles.map}>
        <Marker coordinate={exampleMarker}></Marker>
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
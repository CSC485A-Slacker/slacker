import React, { useState } from 'react';
import { Text, Button, Card, Icon, Chip } from 'react-native-elements';
import { ScrollView, StyleSheet, View } from 'react-native';

type CardsComponentsProps = {};

const Cards: React.FunctionComponent<CardsComponentsProps> = () => {
  const [isVisible, setIsVisible] = useState(false);
  const list = [
    { title: 'List Item 1' },
    { title: 'List Item 2' },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: 'red' },
      titleStyle: { color: 'white' },
      onPress: () => setIsVisible(false),
    },
  ];

  return (
    <View style={styles.container}>
      <Text h4>Hyde Park</Text>
      <Text>6m</Text>
      <Text>Highline</Text>
    <View style={styles.buttonsContainer}>
              <View style={styles.buttonContainer}>
                <Chip title="Check In" containerStyle={{ marginRight: 10}} />
              </View>
              <View style={styles.buttonContainer}>
                 <Chip
              title="Reviews"
              type="outline"
            containerStyle={{ marginHorizontal: 10 }}
        />
      </View>
      <View style={styles.buttonContainer}>
                 <Chip
              title="Photos"
              type="outline"
              containerStyle={{ marginHorizontal: 10 }}
        />
        </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
        flex: 1,
        alignItems: 'flex-start',
        margin: 10,
  },
  buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        // justifyContent: 'center',
        marginVertical: 10,
    },
    buttonContainer: {
      flex: 1,
    }
});

export default Cards;
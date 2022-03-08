import { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  StatusBar,
} from "react-native";
import { Text, Input, FAB } from "react-native-elements";
import { useDispatch } from "react-redux";
import { Pin, updatePin } from "../../redux/PinSlice";


const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

export const ReviewsScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { newPin } = route.params;

  const [name, onChangeName] = useState("");
  const [type, onChangeType] = useState("");
  const [description, onChangeDescription] = useState("");
  const [length, onChangeLength] = useState("");

  const onConfirmPress = () => {
    const confirmPin: Pin = {
      key: newPin.key,
      coordinate: newPin.coordinate,
      draggable: false,
      color: "red",
      title: name,
      description: description,
      type: type,
      length: parseInt(length),
    };
    dispatch(updatePin(confirmPin));
    navigation.navigate({
      name: "Map",
      params: {
        confirmedPin: true,
      },
    });
  };

  const renderItem = ({ item }) => (
    <Item title={item.title} />
  );

  return (
      <View style={styles.container}>
        <Text style={styles.text} h4>
          Reviews
      </Text>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
        <FAB
          containerStyle={{ margin: 20 }}
          visible={true}
          icon={{ name: "add", color: "white" }}
          color="#219f94"
          title="Add Your Own Review"
          onPress={onConfirmPress}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  view: {
    margin: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  text: {
    padding: 40,
    color: "#219f94",
  },
  input: {
    fontSize: 14,
    padding: 10,
  },
});

import { useState } from "react";
import { StyleSheet, View, FlatList, StatusBar } from "react-native";
import { Text, Input, FAB } from "react-native-elements";
import { useDispatch } from "react-redux";
import { Pin, updatePin } from "../../redux/PinSlice";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
  },
];

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

export const ReviewsScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { pin } = route.params;

  const [name, onChangeName] = useState("");
  const [type, onChangeType] = useState("");
  const [description, onChangeDescription] = useState("");
  const [length, onChangeLength] = useState("");

  const onConfirmPress = () => {
    dispatch(updatePin(pin));
    navigation.navigate({
      name: "Map",
      params: {
        confirmedPin: true,
      },
    });
  };

  const renderItem = ({ item }) => <Item title={item.title} />;

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <Text style={styles.text} h4>
            Reviews
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <FAB
            visible={true}
            icon={{ name: "add", color: "white" }}
            color="#219f94"
            title="Add Your Own Review"
            onPress={onConfirmPress}
          />
        </View>
      </View>

      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    // justifyContent: 'center',
    marginVertical: 10,
  },
  item: {
    backgroundColor: "#f9c2ff",
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

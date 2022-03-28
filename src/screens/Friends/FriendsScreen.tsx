import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-elements";
import { Database } from "../../data/Database";
import { defaultColor } from "../../style/styles";

export const FriendsScreen = ({ navigation }: any) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Friends is under construction!</Text>
      <Text>No friends yet 😢</Text>
      <Button
        title={"Find friends"}
        onPress={(e) => {
          navigation.navigate("Search Friends");
        }}
        buttonStyle={{
          backgroundColor: defaultColor,
          borderWidth: 2,
          borderColor: "white",
          borderRadius: 30,
        }}
      />
      <Button
        title={"Friend Requests"}
        onPress={(e) => {
          navigation.navigate("Friend Request");
        }}
        buttonStyle={{
          backgroundColor: defaultColor,
          borderWidth: 2,
          borderColor: "white",
          borderRadius: 30,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    margin: 10,
    marginTop: 20,
    flex: 1,
    justifyContent: "flex-start",
  },
  container: {
    alignItems: "center",
  },
  title: {
    padding: 40,
    paddingBottom: 10,
    fontSize: 18,
    color: "#219f94",
  },
  item: {
    flexDirection: "row",
    marginTop: 10,
  },
  itemContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  subText: {
    alignItems: "center",
    padding: 10,
    fontSize: 14,
    color: "#626264",
  },
});

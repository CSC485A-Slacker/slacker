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
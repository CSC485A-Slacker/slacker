import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Image, FlatList } from "react-native";
import { Button, Card, Text, Icon, ListItem, Avatar } from "react-native-elements";
import { Database } from "../../data/Database";
import { auth } from "../../config/FirebaseConfig";
import { User } from "../../data/User";
import { Status } from "../../data/Interfaces";
import { defaultColor } from "../../style/styles";
import {Dimensions} from 'react-native';

const db = new Database();

export const FriendsScreen = ({ navigation }: any) => {
  const [currentUser, setCurrentUser] = useState<User>();
  const numFriendRequests = currentUser?._friends.filter((friend) => friend._status == Status.received).length;
  const friendsRequestTitle = "Requests (" + numFriendRequests + ")";

  const getCurrentUser = async () => {
    try {
      const userDB = await db.getUser(auth.currentUser?.uid || "");
      if (userDB.data) {
        setCurrentUser(userDB.data);
      } // add an else saying can't get current user
    } catch (error) {
      console.log(`Error getting to get current user: ${error}`);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleChat = ( userID ) => {
    return navigation.navigate("Friend Chat", { userID } );
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ScrollView>
        <View style={styles.container}>
          <Card containerStyle={styles.card_container}>
            <Card.Image
              style={styles.card_image}
              source={require("../../assets/friends-header.png")}
            />
            <Text style={{ alignSelf: 'center', paddingTop: 10 }}>
              Welcome to your friends page!
            </Text>
            <View style={styles.buttonsContainer}>
              <View style={styles.buttonContainer}>
                <Button
                  title="Find Friends"
                  icon={{ name: 'add', size: 20, color: 'white' }}
                  iconRight
                  buttonStyle={{
                    backgroundColor: defaultColor,
                    borderWidth: 2,
                    borderColor: "white",
                    borderRadius: 30,
                  }}
                  containerStyle={{
                    marginRight: 10,
                  }}
                  titleStyle={{ fontSize: 14 }}
                  onPress={(e) => {
                    navigation.navigate("Search Friends");
                  }}
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  title={friendsRequestTitle}
                  buttonStyle={{
                    backgroundColor: "white",
                    borderWidth: 1,
                    borderColor: defaultColor,
                    borderRadius: 30,
                  }}
                  type="outline"
                  containerStyle={{
                    marginRight: 10,
                  }}
                  titleStyle={{ fontSize: 14, color: defaultColor }}
                  onPress={(e) => {
                    navigation.navigate("Friend Requests");
                  }}
                />
              </View>
            </View>
          </Card>
          <Card>
          <Card.Title>Your Friends</Card.Title> 
          <Card.Divider />
            {currentUser?._friends.map((u, i) => {
              return (
                <View style={styles.friendView}>
                  <Avatar
                    size={36}
                    rounded
                    title={u._username.charAt(0)}
                    containerStyle={{ backgroundColor: defaultColor }}
                  />
                  <Text style={styles.subText}>{u._username}</Text>
                  <View style={styles.itemContainer}>
                    <Button
                      title="Chat"
                      type="clear"
                      titleStyle={{ fontSize: 15, color: defaultColor }}
                      onPress={() => handleChat(u._friendID)}
                    />
                  </View>
                </View>
              );
            })}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fonts: {
    marginBottom: 8,
  },
  user: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  buttonContainer: {
    flex: 1,
  },
  card_container: {
    width: Dimensions.get('window').width - Dimensions.get('window').width / 15,
  },
  card_image: {
    flexGrow: 1,
    borderRadius : 10
  },
  friendView: {
    flexDirection: "row",
    // marginTop: 10,
    padding: 10,
  },
  view: {
    margin: 10,
    marginTop: 20,
    flex: 1,
    justifyContent: "flex-start",
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
    padding: 8,
    fontSize: 16,
    color: "#626264",
  },
});

import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import {
  Text,
  SearchBar,
  Avatar,
  Button,
  Card,
  Icon,
} from "react-native-elements";
import { auth } from "../../config/FirebaseConfig";
import { Database } from "../../data/Database";
import { Friend, User } from "../../data/User";
import { Status } from "../../data/Interfaces";
import { darkBlueColor, defaultColor, greyColor } from "../../style/styles";
import { useToast } from "react-native-toast-notifications";

const db = new Database();

export const SearchFriendsScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>();
  const toast = useToast();

  const getCurrentUser = async () => {
    try {
      const userDB = await db.getUser(auth.currentUser?.uid || "");
      if (userDB.succeeded && userDB.data) {
        setCurrentUser(userDB.data);
        getAllUsers(userDB.data);
      } else {
        Alert.alert("We have an error on our side. Please try again later.");
        navigation.navigate("All Friends");
      }
    } catch (error) {
      console.log(`Error getting to get current user: ${error}`);
      Alert.alert("We have an error on our side. Please try again later.");
      navigation.navigate("All Friends");
    }
  };

  const getAllUsers = async (currUser: User) => {
    try {
      const response = await db.getAllUsers();
      if (response.data) {
        // exclude the currents user's id and their friend's ids
        const excludedIds = currUser?._friends.map(
          ({ _friendID }) => _friendID
        );
        excludedIds.push(currUser._userID);
        const filterAllUsers = response.data.filter(
          (user) => !excludedIds.includes(user._userID)
        );
        setAllUsers(filterAllUsers);
        setFilteredUsers(filterAllUsers);
      } else {
        Alert.alert("We have an error on our side. Please try again later.");
        navigation.navigate("All Friends");
      }
    } catch (error) {
      console.log(`Error getting to retrieve all users: ${error}`);
      Alert.alert("We have an error on our side. Please try again later.");
      navigation.navigate("All Friends");
    }
  };

  const updateAllUsers = (currUser: User) => {
    const excludedIds = currUser?._friends.map(({ _friendID }) => _friendID);
    excludedIds.push(currUser._userID);
    const filterAllUsers = allUsers.filter(
      (user) => !excludedIds.includes(user._userID)
    );
    setAllUsers(filterAllUsers);
    setFilteredUsers(filterAllUsers);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const searchFilter = (text) => {
    if (text) {
      const newData = allUsers.filter(function (item) {
        const itemData = item._username
          ? item._username.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredUsers(newData);
      setSearch(text);
    } else {
      // Inserted text is blank, set to all useers
      setFilteredUsers(allUsers);
      setSearch(text);
    }
  };

  const sendFriendRequest = async (friend: User) => {
    try {
      if (currentUser) {
        // update current user to show that they have sent a friend request
        currentUser._friends.push(
          new Friend(friend._userID, friend._username, Status.sent)
        );
        const respUser = await db.editFriends(
          currentUser._userID,
          currentUser._friends
        );
        // update friend to show that they have a new friend request
        friend._friends.push(
          new Friend(
            currentUser._userID,
            currentUser._username,
            Status.received
          )
        );
        const respFriend = await db.editFriends(
          friend._userID,
          friend._friends
        );

        if (respUser.succeeded && respFriend.succeeded) {
          toast.show(
            `Sent ${
              friend._username != "" ? friend._username : ""
            } a friend request!`,
            {
              type: "success",
            }
          );
          updateAllUsers(currentUser);
        }
      }
    } catch (error) {
      console.log(`Error trying to add friend: ${error}`);
    }
  };

  const FriendView = ({ user }: any) => (
    <Card
      containerStyle={styles.favoriteContainer}
      wrapperStyle={{ borderColor: "white" }}
    >
      <View style={styles.inlineContainer}>
        <Avatar
          size={36}
          rounded
          title={user._username.charAt(0)}
          containerStyle={{ backgroundColor: darkBlueColor }}
        />
        <Text style={styles.subText}>{user._username}</Text>
        <View style={styles.itemContainer}>
          <Button
            title="Add Friend"
            type="clear"
            titleStyle={{ color: defaultColor, fontSize: 16 }}
            onPress={() => sendFriendRequest(user)}
            icon={{
              name: "person-add",
              type: "material",
              size: 16,
              color: defaultColor,
            }}
          />
        </View>
      </View>
    </Card>
  );

  const renderItem = ({ item }: any) => {
    return <FriendView user={item} />;
  };

  return (
    <View style={styles.view}>
      <View style={styles.container}>
        <Text style={styles.title} h3>
          Discover Friends
        </Text>
        <Text style={styles.text}>
          Please note that the user will have to accept your request before
          becoming friends
        </Text>
      </View>
      <SearchBar
        placeholder="Search by username"
        onChangeText={(text) => searchFilter(text)}
        onClear={() => searchFilter("")}
        value={search}
        autoCapitalize="none"
        containerStyle={styles.searchContainer}
        inputContainerStyle={{ backgroundColor: "white" }}
        inputStyle={{ fontSize: 14 }}
      />

      <View>
        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={(user) => user._username}
        />
      </View>
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
  searchContainer: {
    backgroundColor: "white",
    borderTopColor: "white",
    borderBottomColor: "white",
    padding: 0,
    marginBottom: 10,
  },
  favoriteContainer: {
    backgroundColor: "white",
    borderColor: "white",
    marginHorizontal: 0,
    marginTop: 5,
    marginBottom: 5,
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  inlineContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  title: {
    padding: 30,
    paddingBottom: 10,
    color: defaultColor,
  },
  text: {
    textAlign: "center",
    paddingBottom: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    color: greyColor,
  },
  subText: {
    alignItems: "center",
    padding: 10,
    fontSize: 16,
    color: greyColor,
  },
});

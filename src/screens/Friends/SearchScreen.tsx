import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { Text, SearchBar, Avatar, Button } from "react-native-elements";
import { auth } from "../../config/FirebaseConfig";
import { Database } from "../../data/Database";
import { Friend, User } from "../../data/User";
import { Status } from "../../data/Interfaces";
import { darkBlueColor } from "../../style/styles";

const db = new Database();

export const SearchFriendsScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>();

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

  useEffect(() => {
    getCurrentUser();
  }, []);

  // add
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
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredUsers(allUsers);
      setSearch(text);
    }
  };

  const sendFriendRequest = async (friend: User) => {
    try {
      if (currentUser) {
        // update current user to show that they have sent a friend request
        currentUser._friends.push(new Friend(friend._userID, Status.sent));
        const respUser = await db.editFriends(
          currentUser._userID,
          currentUser._friends
        );
        // update friend to show that they have a new friend request
        friend._friends.push(new Friend(currentUser._userID, Status.received));
        const respFriend = await db.editFriends(
          friend._userID,
          friend._friends
        );

        if (respUser.succeeded && respFriend.succeeded) {
          getAllUsers(currentUser);
        }
      }
    } catch (error) {
      console.log(`Error trying to add friend: ${error}`);
    }
  };

  const FriendView = ({ user }) => (
    <View style={styles.item}>
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
          titleStyle={{ color: darkBlueColor, fontSize: 16 }}
          onPress={() => sendFriendRequest(user)}
        />
      </View>
    </View>
  );

  const renderItem = ({ item }) => {
    return <FriendView user={item} />;
  };

  return (
    <View style={styles.view}>
      <View style={styles.container}>
        <Text style={styles.title} h4>
          Discover Friends
        </Text>
      </View>
      <SearchBar
        placeholder="Search by username"
        onChangeText={(text) => searchFilter(text)}
        onClear={(text) => searchFilter("")}
        value={search}
        autoCapitalize="none"
        // platform={platform}
        containerStyle={{
          backgroundColor: "white",
          borderTopColor: "white",
          borderBottomColor: "white",
          padding: 0,
        }}
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

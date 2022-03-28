import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {
  Text,
  SearchBar,
  Avatar,
  Button,
  Tab,
  TabView,
} from "react-native-elements";
import { auth } from "../../config/FirebaseConfig";
import { Database } from "../../data/Database";
import { Friend, User } from "../../data/User";
import { Status } from "../../data/Interfaces";
import { defaultStyles } from "../../style/styles";

const db = new Database();

export const SearchFriendsScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>();

  const getCurrentUser = async () => {
    try {
      const userDB = await db.getUser(auth.currentUser?.uid || "");
      if (userDB.data) {
        setCurrentUser(userDB.data);
      } // TODO: add an else saying can't get current user
    } catch (error) {
      console.log(`Error getting to get current user: ${error}`);
    }
  };

  const getAllUsers = async () => {
    if (!currentUser) {
      getCurrentUser();
    }
    try {
      const response = await db.getAllUsers();
      if (response.data && currentUser) {
        // exclude the currents user's id and their friend's ids
        const excludedIds = currentUser?._friends.map(
          ({ _friendID }) => _friendID
        );
        excludedIds.push(currentUser._userID);
        const filterAllUsers = response.data.filter(
          (user) => !excludedIds.includes(user._userID)
        );
        setAllUsers(filterAllUsers);
        setFilteredUsers(filterAllUsers);
      } // add an else saying can't get current users
    } catch (error) {
      console.log(`Error getting to retrieve all users: ${error}`);
    }
  };

  useEffect(() => {
    getCurrentUser();
    getAllUsers();
  }, []);

  // add
  const searchFilter = (text) => {
    if (text) {
      setSearch(text);
      getAllUsers();
    }
  };

  const addFriend = async (friend: User) => {
    console.log(currentUser);
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
          getAllUsers();
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
        containerStyle={{ backgroundColor: "#1b4557" }}
      />
      <Text style={styles.subText}>{user._username}</Text>
      <View style={styles.itemContainer}>
        <Button
          title="Add Friend"
          type="clear"
          titleStyle={{ color: "#1b4557" }}
          onPress={() => addFriend(user)}
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
        value={search}
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
        <Text style={defaultStyles.title}>Request Sent</Text>
        <FlatList
          data={allUsers}
          renderItem={renderItem}
          keyExtractor={(user) => user._username}
        />
      </View>
      <View>
        <Text style={defaultStyles.title}>Request Received</Text>
        <FlatList
          data={allUsers}
          renderItem={renderItem}
          keyExtractor={(user) => user._username}
        />
      </View>
      <View>
        <Text style={defaultStyles.title}>Friends Pendings</Text>
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

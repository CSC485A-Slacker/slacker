import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  SectionList,
} from "react-native";
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
import {
  darkBlueColor,
  defaultColor,
  defaultStyles,
  greyColor,
  hotColor,
} from "../../style/styles";

const db = new Database();

export const RequestScreen = ({ navigation }: any) => {
  const [friendRequest, setFriendRequest] = useState<User[]>([]);
  const [friendInvites, setFriendInvites] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>();

  const getCurrentUser = async () => {
    try {
      const userDB = await db.getUser(auth.currentUser?.uid || "");
      if (userDB.succeeded) {
        setCurrentUser(userDB.data);
        getAllUsers(userDB.data);
      } // TODO: add an else saying can't get current user
    } catch (error) {
      console.log(`Error getting to get current user: ${error}`);
    }
  };

  const getAllUsers = async (currUser: User) => {
    try {
      const response = await db.getAllUsers();
      if (response.data) {
        // include the currents user friend's ids
        const friendIds = currUser?._friends.map(({ _friendID }) => _friendID);

        const filterAllUsers = response.data.filter((user) =>
          friendIds.includes(user._userID)
        );
        getFriendRequests(currUser, filterAllUsers);
        getFriendInvites(currUser, filterAllUsers);
      } // add an else saying can't get current users
    } catch (error) {
      console.log(`Error getting to retrieve all users: ${error}`);
    }
  };

  const getFriendRequests = (currUser: User, allCurrUsers: User[]) => {
    const requestIds = currUser?._friends
      .filter((friend) => friend._status == Status.received)
      .map(({ _friendID }) => _friendID);

    const filterAllUsers = allCurrUsers.filter((user) =>
      requestIds.includes(user._userID)
    );
    setFriendRequest(filterAllUsers);
  };

  const getFriendInvites = (currUser: User, allCurrUsers: User[]) => {
    const inviteIds = currUser?._friends
      .filter((friend) => friend._status == Status.sent)
      .map(({ _friendID }) => _friendID);

    const filterAllUsers = allCurrUsers.filter((user) =>
      inviteIds.includes(user._userID)
    );
    setFriendInvites(filterAllUsers);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const acceptFriendRequest = async (friend: User) => {
    try {
      if (currentUser) {
        // update current user to show that they have sent a friend request
        const filterUser = currentUser._friends.map((user) => {
          if (user._friendID == friend._userID) {
            return { ...user, _status: Status.accepted };
          } else {
            return user;
          }
        });
        const respUser = await db.editFriends(currentUser._userID, filterUser);
        // update friend to show that they have a new friend request
        const filterFriend = friend._friends.map((user) => {
          if (user._friendID == currentUser._userID) {
            return { ...user, _status: Status.accepted };
          } else {
            return user;
          }
        });
        const respFriend = await db.editFriends(friend._userID, filterFriend);

        if (respUser.succeeded && respFriend.succeeded) {
          getCurrentUser();
        }
      }
    } catch (error) {
      console.log(`Error trying to add friend: ${error}`);
    }
  };

  const cancelFriendRequest = async (friend: User) => {
    try {
      if (currentUser) {
        // update current friend list to remove request
        const filterUser = currentUser._friends.filter(
          (user) => user._friendID != friend._userID
        );
        const respUser = await db.editFriends(currentUser._userID, filterUser);

        // update friend to remove request
        const filterFriend = friend._friends.filter(
          (user) => user._friendID != currentUser._userID
        );
        const respFriend = await db.editFriends(friend._userID, filterFriend);

        if (respUser.succeeded && respFriend.succeeded) {
          getCurrentUser();
        }
      }
    } catch (error) {
      console.log(`Error trying to add friend: ${error}`);
    }
  };

  const RequestView = ({ user }) => (
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
          titleStyle={{ color: darkBlueColor, fontSize: 16 }}
          onPress={() => acceptFriendRequest(user)}
        />
      </View>
      <View style={styles.itemContainer}>
        <Button
          title="Deny"
          type="clear"
          titleStyle={{ color: hotColor, fontSize: 16 }}
          onPress={() => cancelFriendRequest(user)}
        />
      </View>
    </View>
  );

  const InviteView = ({ user }) => (
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
          title="Cancel Request"
          type="clear"
          titleStyle={{ color: hotColor, fontSize: 16 }}
          onPress={() => cancelFriendRequest(user)}
        />
      </View>
    </View>
  );

  const renderRequests = ({ item }) => {
    return <RequestView user={item} />;
  };
  const renderInvites = ({ item }) => {
    return <InviteView user={item} />;
  };

  return (
    <View style={styles.view}>
      <View style={styles.container}>
        <Text style={styles.title} h4>
          Current Friend Invites
        </Text>
      </View>
      <View>
        <Text style={styles.subTitle}>Request Received</Text>
        <FlatList
          data={friendRequest}
          renderItem={renderRequests}
          keyExtractor={(user) => user._username}
        />
      </View>
      <View>
        <Text style={styles.subTitle}>Request Sent</Text>
        <FlatList
          data={friendInvites}
          renderItem={renderInvites}
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
    color: defaultColor,
  },
  subTitle: {
    fontSize: 16,
    color: greyColor,
    paddingTop: 10,
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
    color: greyColor,
  },
});

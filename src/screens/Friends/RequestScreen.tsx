import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, Avatar, Button, Card } from "react-native-elements";
import { auth } from "../../config/FirebaseConfig";
import { Database } from "../../data/Database";
import { User } from "../../data/User";
import { Status } from "../../data/Interfaces";
import {
  darkBlueColor,
  defaultColor,
  greyColor,
  hotColor,
} from "../../style/styles";
import { useToast } from "react-native-toast-notifications";

const db = new Database();
const errorMessage = "Whoops! We have an error on our side. Please try again later.";

export const RequestScreen = ({ navigation }: any) => {
  const toast = useToast();
  const [friendRequest, setFriendRequest] = useState<User[]>([]);
  const [friendInvites, setFriendInvites] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>();

  const getCurrentUser = async () => {
    try {
      const userDB = await db.getUser(auth.currentUser?.uid || "");
      if (userDB.succeeded && userDB.data) {
        setCurrentUser(userDB.data);
        getAllUsers(userDB.data);
      } else {
        toast.show(errorMessage, {
            type: "danger",
        });
        navigation.navigate("All Friends");
      }
    } catch (error) {
      console.log(`Error getting to get current user: ${error}`);
      toast.show(errorMessage, {
            type: "danger",
        });
      navigation.navigate("All Friends");
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
      } else {
        toast.show(errorMessage, {
            type: "danger",
        });
        navigation.navigate("All Friends");
      }
    } catch (error) {
      console.log(`Error getting to retrieve all users: ${error}`);
      toast.show(errorMessage, {
            type: "danger",
        });
      navigation.navigate("All Friends");
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
          toast.show(
            `Added ${
              friend._username != "" ? friend._username : ""
            } as a friend!`,
            {
              type: "success",
            }
          );
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
          toast.show(
            `Canceled friend invite ${
              friend._username != "" ? "with " + friend._username : ""
            }`,
            {
              type: "normal",
            }
          );
          getCurrentUser();
        }
      }
    } catch (error) {
      console.log(`Error trying to add friend: ${error}`);
    }
  };

  const RequestView = ({ user }: any) => (
    <Card
      containerStyle={styles.favoriteContainer}
      wrapperStyle={{ borderColor: "white" }}
    >
      <View style={styles.inlineContainer}>
        <View style={styles.closeContainer}>
          <Avatar
            size={36}
            rounded
            title={user._username.charAt(0)}
            containerStyle={{ backgroundColor: "#1b4557" }}
          />
          <Text style={styles.nameText}>{user._username}</Text>
        </View>
        <View style={styles.closeContainer}>
          <View style={styles.closeContainer}>
            <Button
              title="Add"
              type="clear"
              titleStyle={{ color: defaultColor, fontSize: 16 }}
              onPress={() => acceptFriendRequest(user)}
              icon={{
                name: "mood",
                type: "material",
                size: 16,
                color: defaultColor,
              }}
            />
          </View>
          <View style={styles.closeContainer}>
            <Button
              title="Decline"
              type="clear"
              titleStyle={{ color: hotColor, fontSize: 16 }}
              onPress={() => cancelFriendRequest(user)}
              icon={{
                name: "block",
                type: "material",
                size: 16,
                color: hotColor,
              }}
            />
          </View>
        </View>
      </View>
    </Card>
  );

  const InviteView = ({ user }: any) => (
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
        <Text style={styles.nameText}>{user._username}</Text>
        <View style={styles.itemContainer}>
          <Button
            title="Cancel"
            type="clear"
            titleStyle={{ color: hotColor, fontSize: 16 }}
            onPress={() => cancelFriendRequest(user)}
            icon={{
              name: "person-remove",
              type: "material",
              size: 16,
              color: hotColor,
            }}
          />
        </View>
      </View>
    </Card>
  );

  const renderRequests = ({ item }: any) => {
    return <RequestView user={item} />;
  };
  const renderInvites = ({ item }: any) => {
    return <InviteView user={item} />;
  };

  return (
    <View style={styles.view}>
      <View style={styles.container}>
        <Text style={styles.title} h3>
          Friend Invites
        </Text>
        <Text style={styles.text}>
          Here you can confirm or cancel friend invites
        </Text>
      </View>
      <View>
        <Text style={styles.subTitle}>Received</Text>
        {friendRequest.length == 0 ? (
          <Text style={styles.subText}>No invites to be found...</Text>
        ) : (
          <FlatList
            data={friendRequest}
            renderItem={renderRequests}
            keyExtractor={(user) => user._username}
          />
        )}
      </View>
      <View>
        <Text style={styles.subTitle}>Sent</Text>
        {friendInvites.length == 0 ? (
          <Text style={styles.subText}>No invites to be found...</Text>
        ) : (
          <FlatList
            data={friendInvites}
            renderItem={renderInvites}
            keyExtractor={(user) => user._username}
          />
        )}
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
  closeContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  itemContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  title: {
    padding: 40,
    paddingBottom: 10,
    color: defaultColor,
  },
  subTitle: {
    fontSize: 18,
    color: darkBlueColor,
    paddingTop: 10,
    paddingHorizontal: 10,
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
    fontSize: 14,
    color: greyColor,
  },
  nameText: {
    alignItems: "center",
    padding: 10,
    fontSize: 16,
    color: greyColor,
  },
});

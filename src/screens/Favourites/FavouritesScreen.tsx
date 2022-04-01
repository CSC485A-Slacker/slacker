import { StyleSheet, View, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { darkBlueColor, defaultColor, greyColor } from "../../style/styles";
import { Text, Divider } from "react-native-elements";
import React from "react";
import FavoriteCard from "../../components/FavoriteCard";
import { auth } from "../../config/FirebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PrivateCard from "../../components/PrivateCard";

export const FavouritesScreen = () => {
  const user = auth.currentUser;

  // TODO: adjust filter to only select the user's favourite pins
  const allPins = useSelector((state: RootState) => state.pins.pins);

  const favouritePins = allPins.filter((pin) => {
    if (user) return pin.favoriteUsers.includes(user.uid);
  });

  const privatePins = allPins.filter((pin) => {
    if (user) return pin.privateViewers.includes(user.uid);
  });

  const numFavourites = favouritePins.length;
  const numPrivate = privatePins.length;

  const renderFavorite = ({ item }) => <FavoriteCard pin={item} />;
  const renderPrivate = ({ item }) => <PrivateCard pin={item} />;

  function HomeScreen() {
    return (
      <View style={styles.view}>
        <View style={styles.container}>
          <Text style={styles.title} h3>
            Favorite Pins
          </Text>
          {numFavourites == 1 ? (
            <Text style={styles.subTitle}>{numFavourites} spot</Text>
          ) : (
            <Text style={styles.subTitle}>{numFavourites} spots</Text>
          )}
        </View>
        <View>
          <FlatList
            data={favouritePins}
            renderItem={renderFavorite}
            keyExtractor={(item) => item.key}
          />
        </View>
      </View>
    );
  }

  function SettingsScreen() {
    return (
      <View style={styles.view}>
        <View style={styles.container}>
          <Text style={styles.title} h3>
            Private Pins
          </Text>
          {numFavourites == 1 ? (
            <Text style={styles.subTitle}>{numFavourites} spot</Text>
          ) : (
            <Text style={styles.subTitle}>{numFavourites} spots</Text>
          )}
        </View>
        <View>
          <FlatList
            data={privatePins}
            renderItem={renderPrivate}
            keyExtractor={(item) => item.key}
          />
        </View>
      </View>
    );
  }
  const Tab = createMaterialTopTabNavigator();

  return (
    <View style={styles.navView}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, textTransform: "capitalize" },
          tabBarActiveTintColor: darkBlueColor,
          tabBarIndicatorStyle: {
            backgroundColor: defaultColor,
          },
          tabBarShowIcon: true,
        }}
      >
        <Tab.Screen
          name="Favorite"
          component={HomeScreen}
          options={{
            tabBarLabel: "Favourite",
          }}
        />
        <Tab.Screen
          name="Private"
          component={SettingsScreen}
          options={{
            tabBarLabel: "Private",
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  navView: {
    backgroundColor: "white",
    paddingTop: 40,
    flex: 1,
    justifyContent: "flex-start",
  },
  view: {
    // backgroundColor: "white",
    margin: 10,
    flex: 1,
    justifyContent: "flex-start",
  },
  container: {
    alignItems: "center",
    // backgroundColor: "white",
  },
  title: {
    paddingTop: 30,
    color: defaultColor,
    textAlign: "center",
  },
  subTitle: {
    color: darkBlueColor,
    fontSize: 16,
    paddingBottom: 20,
  },
  subText: {
    alignItems: "center",
    padding: 10,
    fontSize: 12,
    color: greyColor,
  },
});

import { StyleSheet, View, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { darkBlueColor, defaultColor, greyColor } from "../../style/styles";
import { Text, Divider } from "react-native-elements";
import React from "react";
import FavoriteCard from "../../components/FavoriteCard";
import { auth } from "../../config/FirebaseConfig";

export const FavouritesScreen = () => {
  const user = auth.currentUser;

  // TODO: adjust filter to only select the user's favourite pins
  const pins = useSelector((state: RootState) => state.pins.pins).filter(
    (pin) => {
      if (user) return pin.favoriteUsers.includes(user.uid);
    }
  );

  const renderItem = ({ item }) => <FavoriteCard pin={item} />;

  return (
    <View style={styles.view}>
      <View style={styles.container}>
        <Text style={styles.title} h3>
          Favorites
        </Text>
        <Text style={styles.subTitle}>3 spots</Text>
      </View>
      <Divider />
      <View>
        <FlatList
          data={pins}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    // backgroundColor: "white",
    flex: 1,
    justifyContent: "flex-start",
  },
  container: {
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    paddingTop: 60,
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

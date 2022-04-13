import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Icon, Card } from "react-native-elements";
import { Database } from "../data/Database";
import { Pin } from "../data/Pin";
import { defaultColor, hotColor } from "../style/styles";
import { auth } from "../config/FirebaseConfig";
import { useToast } from "react-native-toast-notifications";

const FavoriteCard = (prop: { pin: Pin }) => {
  const user = auth.currentUser;
  const toast = useToast();

  const database = new Database();

  const [favorite, setFavorite] = useState(true);

  const pin = prop.pin;

  const photos = pin.photos;

  const handleFavorite = () => {
    let newFavorites: string[] = [...pin.favoriteUsers];

    if (favorite) {
      newFavorites = newFavorites.filter((usr) => {
        return usr != user?.uid;
      });
    } else {
      if (!user) alert("You need to be logged in!");
      else newFavorites.push(user?.uid || "");
    }

    database
      .editPinFavorites(pin.coordinate, newFavorites)
      .then(() => {
        // setFavorite(!favorite);
      })
      .finally(() => {
        // pin.favoriteUsers = [...newFavorites];
        toast.show("Removed pin from favorites!", {
          type: "normal",
        });
      });
  };

  return (
    <Card
      containerStyle={styles.favoriteContainer}
      wrapperStyle={{ borderColor: "white" }}
    >
      {photos.length == 0 ? null : (
        <View>
          <Card.Image
            source={{ uri: photos[0].url }}
            style={{ borderRadius: 10 }}
          />
          <Card.Divider />
        </View>
      )}

      <View style={styles.inlineContainer}>
        <Text style={styles.favTitle}>{pin.details.title}</Text>
        <Icon
          name={"favorite"}
          type="material"
          color={hotColor}
          onPress={handleFavorite}
        />
      </View>

      <Text>
        {pin.details.slacklineLength} | {pin.details.slacklineType}
      </Text>
      {/* TODO: add more information? Maybe add a data here about how many times you've been to your favourite place? */}
    </Card>
  );
};

const styles = StyleSheet.create({
  inlineContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  favoriteContainer: {
    backgroundColor: "white",
    borderColor: "white",
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 5,
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  favTitle: {
    color: defaultColor,
    fontSize: 18,
  },
});

export default FavoriteCard;

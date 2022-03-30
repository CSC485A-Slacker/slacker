import { StyleSheet, View } from "react-native";
import { Text, Icon, Card } from "react-native-elements";
import { Pin } from "../data/Pin";
import { defaultColor, hotColor } from "../style/styles";

const FavoriteCard = (prop: { pin: Pin }) => {
  const pin = prop.pin;

  const photos = pin.photos;
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
          // TODO: Add a method here to update favourite for user
          onPress={() => console.log("Update to remove favorite")}
        />
      </View>

      <Text>
        {pin.details.slacklineLength} | {pin.details.slacklineType}
      </Text>
      {/* TODO: add more information? Maybe add a data here about how many times you've been to your favourite place? */}
      <Text>Checked out: 12 times</Text>
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

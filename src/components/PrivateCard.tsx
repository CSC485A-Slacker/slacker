import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, Card, Icon } from "react-native-elements";
import { Pin } from "../data/Pin";
import { defaultColor } from "../style/styles";
import { useToast } from "react-native-toast-notifications";

const PrivateCard = (prop: { pin: Pin; route: any; navigation: any }) => {
  const toast = useToast();

  const pin = prop.pin;
  const navigation = prop.navigation;

  const photos = pin.photos;

  const handleFavorite = () => {
    toast.show("Sorry, we're not able to do this currently.", {
      type: "danger",
    });
  };

  const handleNav = () => {
    navigation.navigate({
      name: "Map",
      params: {
        myPin: pin,
      },
    });
  };

  return (
    <Card
      containerStyle={styles.favoriteContainer}
      wrapperStyle={{ borderColor: "white" }}
    >
      <TouchableOpacity onPress={handleNav}>
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
            name={"share"}
            type="material"
            color={defaultColor}
            onPress={handleFavorite}
          />
        </View>

        <Text>
          {pin.details.slacklineLength} | {pin.details.slacklineType}
        </Text>
      </TouchableOpacity>
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

export default PrivateCard;

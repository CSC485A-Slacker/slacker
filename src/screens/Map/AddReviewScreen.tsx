import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Text, Input, Button } from "react-native-elements";
import { AirbnbRating } from "react-native-ratings";
import { PinReview } from "../../data/Pin";
import { Database } from "../../data/Database";
import { defaultColor, greyColor } from "../../style/styles";
import { useToast } from "react-native-toast-notifications";

const database = new Database();

export const AddReviewScreen = ({ route, navigation }) => {
  const { pin } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [buttomDisabled, setButtomDisabled] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (rating != 0 && comment != "") {
      setButtomDisabled(false);
    }
  }, [rating, comment]);

  const onSubmitPress = async () => {
    try {
      const date = new Date().toJSON();
      const key = comment + "-" + date;
      pin.reviews.push(new PinReview(key, comment, rating, date));
      navigation.navigate({
        name: "Map",
      });
      const resp = await database.editPinReviews(pin.coordinate, pin.reviews);
      if (resp.succeeded) {
        toast.show("Added a review successfully!", {
          type: "success",
        });
      }
    } catch (error) {
      console.log(
        `Error updating pin when trying to save new review: ${error}`
      );
      alert("Review upload failed, sorry :( try again later");
      navigation.navigate({
        name: "Map",
      });
    }
  };

  const ratingCompleted = (rating: number) => {
    setRating(rating);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.view}>
        <View style={styles.container}>
          <Text style={styles.title} h3>
            {pin.details.title}
          </Text>
          <Text style={styles.subTitle}>
            {pin.details.slacklineType} - {pin.details.slacklineLength}m
          </Text>
        </View>
        <View>
          <View style={styles.container}>
            <AirbnbRating
              count={5}
              reviews={[]}
              defaultRating={rating}
              size={20}
              onFinishRating={ratingCompleted}
            />
            <Text style={styles.subText}>Tap on a star to rate the spot</Text>
          </View>
          <Text style={styles.reviewTitle}>Review</Text>
          <Input
            style={styles.input}
            placeholder="Add your thoughts here"
            onChangeText={(comment) => setComment(comment)}
            value={comment}
          />
          <View style={styles.container}>
            <Button
              title="Submit"
              buttonStyle={{
                backgroundColor: defaultColor,
                borderWidth: 1,
                borderColor: "white",
                borderRadius: 30,
                padding: 10,
                width: 150,
              }}
              containerStyle={{
                margin: 15,
              }}
              icon={{
                name: "angle-double-right",
                type: "font-awesome",
                size: 20,
                color: "white",
              }}
              titleStyle={{ fontSize: 16 }}
              onPress={onSubmitPress}
              disabled={buttomDisabled}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  view: {
    margin: 10,
    flex: 1,
    justifyContent: "flex-start",
  },
  container: {
    alignItems: "center",
  },
  title: {
    padding: 40,
    paddingBottom: 10,
    color: defaultColor,
    textAlign: "center"
  },
  subTitle: {
    color: defaultColor,
    paddingBottom: 20,
    fontSize: 16,
  },
  reviewTitle: {
    padding: 10,
    fontSize: 20,
    color: greyColor,
    alignItems: "center",
  },
  subText: {
    alignItems: "center",
    padding: 10,
    fontSize: 12,
    color: greyColor,
  },
  input: {
    fontSize: 12,
  },
});

import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Text, Input, Button } from "react-native-elements";
import { useDispatch } from "react-redux";
import { updatePin } from "../../redux/PinSlice";
import { AirbnbRating } from "react-native-ratings";
import { PinReview } from "../../data/Pin";
import { Database } from "../../data/Database";
const database = new Database();

export const AddReviewScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { pin } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [buttomDisabled, setButtomDisabled] = useState(true);

  useEffect(() => {
    if (rating != 0 && comment != "") {
      setButtomDisabled(false)
    }
  }, [rating, comment])

  const onSubmitPress = async () => {
    try {
      const date = new Date().toJSON();
      const key = comment + "-" + date;
      pin.reviews.push(new PinReview(key, comment, rating, date));
      navigation.navigate({
        name: "Map",
      });
      const resp = await database.editPinReviews(
        pin.coordinate,
        pin.reviews
      );
      console.log(resp);
    } catch (error) {
      console.log(`Error updating pin when trying to save new review: ${error}`);
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
          <Text style={styles.title} h4>
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
          <Button
                title="Submit"
                buttonStyle={{
                  backgroundColor: "#219f94",
                  borderWidth: 1,
                  borderColor: "white",
                  borderRadius: 30,
                }}
                containerStyle={{
                  margin: 15,
                }}
                icon={{ name: "arrow-forward-ios", color: "white" }}
                titleStyle={{ fontSize: 16}}
            onPress={onSubmitPress}
            disabled={buttomDisabled}
              />
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
  reviewContainer: {},
  title: {
    padding: 40,
    paddingBottom: 10,
    color: "#219f94",
  },
  subTitle: {
    color: "#18857b",
    paddingBottom: 20,
  },
  reviewTitle: {
    padding: 10,
    fontSize: 18,
    color: "#626264",
    alignItems: "center",
  },
  subText: {
    alignItems: "center",
    padding: 10,
    fontSize: 12,
    color: "#626264",
  },
  input: {
    fontSize: 12,
  },
});

import { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Text, Input, FAB, Divider } from "react-native-elements";
import { useDispatch } from "react-redux";
import { Pin, updatePin } from "../../redux/PinSlice";
import { AirbnbRating } from 'react-native-ratings';
import { PinReview } from "../../data/Pin";
import { Database } from "../../data/Database";
import { pinConverter } from "../../data/DataConverters";

const database = new Database();

export const AddReviewScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { pin } = route.params;
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");
  

  const onSubmitPress = async () => {
    const date = new Date;
    const key = comment + "-" + date.toUTCString()
    pin.reviews.push(new PinReview(key, comment, rating, date))
    dispatch(updatePin(pin));
    navigation.navigate({
      name: "Map"
    });
    try {
      const resp = await await database.editPinReviews(pin.coordinate, pin.reviews);
      console.log(resp);
      
    } catch(error) {
        console.log(`Error updating pin when trying to save new review: ${error}`);
    }
  };

  const ratingCompleted = (rating: number) => {
    setRating(rating)
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
        <Text style={styles.reviewTitle}>
          Review
        </Text>
        <Input
          style={styles.input}
          placeholder="Add your thoughts here"
          onChangeText={(comment) => setComment(comment)}
          value={comment}
          />
        <FAB
          containerStyle={{ margin: 20 }}
          visible={true}
          icon={{ name: "check", color: "white" }}
          color="#219f94"
          title="Submit"
          onPress={onSubmitPress}
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
  title: {
    padding: 40,
    paddingBottom: 10,
    color: "#219f94",
  },
  subTitle: {
    color: "#18857b",
    paddingBottom: 20
  },
  reviewTitle: {
    padding: 10,
    paddingLeft: 16,
    fontSize: 16,
    color: "#626264",
    alignItems: "center",
  },
  subText: {
    alignItems: "center",
    padding: 10,
    fontSize: 12,
    color: "#626264"
  },
  input: {
    fontSize: 12,
    padding: 10,
  },
});

import { StyleSheet, View } from "react-native";
import { Text, Divider } from "react-native-elements";
import { PinReview } from "../data/Pin";
import { AirbnbRating } from "react-native-ratings";

const ReviewCard = (prop: { review: PinReview; key: string }) => {
  const review = prop.review;

  return (
    <View style={styles.container}>
      <Divider />
      <View style={styles.ratingContainer}>
        <AirbnbRating
          count={5}
          showRating={false}
          defaultRating={review.rating}
          size={10}
          isDisabled={true}
        />
      </View>

      <Text>{review.comment}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
    marginHorizontal: 6,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  text: {
    padding: 10,
  },
});

export default ReviewCard;

import React, { useRef, useState } from "react";
import {
  Platform,
  Animated,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Divider, Button } from "react-native-elements";
import SlidingUpPanel from "rn-sliding-up-panel";
import ReviewCard from "./ReviewCard";
import { Pin, PinReview } from "../data/Pin";

const ios = Platform.OS === "ios";
const TOP_NAV_BAR = 100;
const BOTTOM_NAV_BAR = 135;

function PinInfoOverlay(prop: { pin: Pin; navigation: any }) {
  const pin = prop.pin;
  const navigation = prop.navigation;
  const reviews = pin.reviews;

  // strange calculation here to get the top of the draggable range correct
  const insets = useSafeAreaInsets();
  const statusBarHeight: number = ios ? insets.bottom : insets.top;
  const deviceHeight =
    useWindowDimensions().height - statusBarHeight - TOP_NAV_BAR;
  const draggableRange = {
    top: deviceHeight - statusBarHeight,
    bottom: BOTTOM_NAV_BAR,
  };

  const snappingPoints = [draggableRange.top, draggableRange.bottom];
  const panelRef = useRef<SlidingUpPanel | null>(null);

  const [panelPositionVal] = useState(
    new Animated.Value(draggableRange.bottom)
  );

  return (
    <SlidingUpPanel
      ref={panelRef}
      animatedValue={panelPositionVal}
      draggableRange={draggableRange}
      snappingPoints={snappingPoints}
      backdropOpacity={0}
      containerStyle={styles.panelContainer}
      showBackdrop={false}
      height={deviceHeight}
      allowDragging={true}
      friction={0.999}
    >
      <View style={styles.panelContent}>
        <View style={styles.container}>
          <Text style={ styles.title }h4>{pin.details.title}</Text>
          <Text>{pin.details.slacklineType}</Text>
          <Text>{pin.details.slacklineLength}m</Text>
          <View style={styles.buttonsContainer}>
            <View style={styles.buttonContainer}>
              <Button
                title="Check In"
                buttonStyle={{
                  backgroundColor: "#219f94",
                  borderWidth: 2,
                  borderColor: "white",
                  borderRadius: 30,
                }}
                containerStyle={{
                  marginRight: 10,
                }}
                titleStyle={{ fontSize: 14 }}
                onPress={(e) => {
                  navigation.navigate("Check In");
                }}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Add Review"
                buttonStyle={{
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: "#219f94",
                  borderRadius: 30,
                }}
                type="outline"
                containerStyle={{
                  marginRight: 10,
                }}
                titleStyle={{ fontSize: 14, color: "#219f94" }}
                onPress={(e) => {
                  navigation.navigate("Add a Review", {
                    pin: pin,
                  });
                }}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Add Photos"
                buttonStyle={{
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: "#219f94",
                  borderRadius: 30,
                }}
                type="outline"
                containerStyle={{
                  marginRight: 10,
                }}
                titleStyle={{ fontSize: 14, color: "#219f94" }}
                onPress={(e) => {
                  navigation.navigate("Add a Photo");
                }}
              />
            </View>
          </View>
          <View></View>
          <View>
            <Divider />
            <View style={styles.infoContainer}>
              <Text style={styles.subTitle}>Details</Text>
              <Text style={styles.text}>{pin.details.description}</Text>
              <Text style={styles.text}>
                Total People Visited: {pin.activity.totalUsers}
              </Text>
            </View>
            <Divider />

            <Text style={styles.subTitle}>Reviews</Text>
            {reviews.length != 0 ? (
              <ScrollView>
                {reviews.map((review: PinReview) => (
                  <ReviewCard review={review} key={review.key} />
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.text}>
                No reviews yet... why not add the first one?
              </Text>
            )}
          </View>
          <Divider style={styles.divider}/>
        </View>
      </View>
    </SlidingUpPanel>
  );
}

const styles = StyleSheet.create({
  panelContent: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  panelContainer: {
    borderRadius: 25,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  container: {
    flex: 1,
    margin: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  buttonContainer: {
    flex: 1,
  },
  infoContainer: {
    paddingBottom: 10,
  },
  title: {
    paddingTop: 10,
  },
  subTitle: {
    fontSize: 20,
    color: "#219f94",
    padding: 10,
    paddingBottom: 4,
    paddingLeft: 4,
  },
  smallText: {
    fontSize: 12,
    paddingVertical: 4,
  },
  text: {
    padding: 2,
    paddingLeft: 4,
  },
  divider: {
    paddingBottom: 14,
  }
});

export default PinInfoOverlay;

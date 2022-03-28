import React, { useRef, useState } from "react";
import {
  Platform,
  Animated,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Divider, Button } from "react-native-elements";
import SlidingUpPanel from "rn-sliding-up-panel";
import ReviewCard from "./ReviewCard";
import { Pin, PinPhoto, PinReview } from "../data/Pin";
import PhotoItem from "./PhotoItem";
import { auth } from "../config/FirebaseConfig";
import { LatLng } from "react-native-maps";
import { Database } from "../data/Database";
import { defaultColor } from "../style/styles";
import { userIsCheckedIntoSpot } from "../data/User";

const ios = Platform.OS === "ios";
const TOP_NAV_BAR = 100;
const BOTTOM_NAV_BAR = 135;
const database = new Database();

function PinInfoOverlay(prop: { pin: Pin; navigation: any }) {
  const pin = prop.pin;
  const navigation = prop.navigation;
  const reviews = pin.reviews;
  const photos = pin.photos;
  const user = auth.currentUser

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
  const [dragging, setDragging] = useState(true);

  const [panelPositionVal] = useState(
    new Animated.Value(draggableRange.bottom)
  );

  const handleCheckIn = (pinId: number, pinCoords: LatLng, userId: string|undefined, pinTitle: string) => {
    if (userId) {
      const userPromise = database.getUser(userId);
      userPromise.then(result => {
        const usr = result.data
        if (usr?._checkInSpot) {
            if(userIsCheckedIntoSpot(usr, pinCoords)) {
                Alert.alert('You are already checked in here!')
                navigation.navigate("Map")
                return
            }
        }
        navigation.navigate("Check-In Details", { pinId, pinCoords, usr, pinTitle })
      })
    } else {
      Alert.alert('You must be signed in to use this feature!')
    }
  }

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
      allowDragging={dragging}
      friction={0.999}
    >
      <View style={styles.panelContent}>
        <View style={styles.container}>
          <Text h4>{pin.details.title}</Text>
          <Text>{pin.details.slacklineType}</Text>
          <Text>{pin.details.slacklineLength}m</Text>
          <View style={styles.buttonsContainer}>
            <View style={styles.buttonContainer}>
              <Button
                title="Check In"
                icon={{ name: 'angle-double-right', type: 'font-awesome', size: 20, color: 'white' }}
                iconRight
                buttonStyle={{
                  backgroundColor: defaultColor,
                  borderWidth: 2,
                  borderColor: "white",
                  borderRadius: 30,
                }}
                containerStyle={{
                  marginRight: 10,
                }}
                titleStyle={{ fontSize: 14 }}
                onPress={() => handleCheckIn(pin.key, pin.coordinate, user?.uid, pin.details.title)}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Add Review"
                buttonStyle={{
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: defaultColor,
                  borderRadius: 30,
                }}
                type="outline"
                containerStyle={{
                  marginRight: 10,
                }}
                titleStyle={{ fontSize: 14, color: defaultColor }}
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
                  borderColor: defaultColor,
                  borderRadius: 30,
                }}
                type="outline"
                containerStyle={{
                  marginRight: 10,
                }}
                titleStyle={{ fontSize: 14, color: defaultColor }}
                onPress={(e) => {
                  navigation.navigate("Add a Photo", {
                    pin: pin,
                  });
                }}
              />
            </View>
          </View>
          <View>
            <Divider style={styles.divider}/>
            {photos.length != 0 ? (
              <ScrollView
                horizontal={true}
              >
                {photos.map((photo: PinPhoto) => (
                   <PhotoItem photo={photo} key={photo.url} />
                ))}
              </ScrollView>
            ) : (
                <View>
                  <Text style={styles.subTitle}>Photos</Text>
                  <Text style={styles.text}>
                    Share your photos using the buttom above!
                  </Text>
                </View>
              
            )}
          </View>
          <View>
            <Divider style={styles.divider}/>
            <View style={styles.infoContainer}>
              <Text style={styles.subTitle}>Details</Text>
              <Text style={styles.text}>{pin.details.description}</Text>
              <Text style={styles.text}>
                Active Slackliners: {pin.activity.activeUsers}
              </Text>
              <Text style={styles.text}>
                Total People Visited: {pin.activity.totalUsers}
              </Text>
              <Text style={styles.text}>
                {pin.activity.shareableSlackline ? 
                "Slacklining gear is available to share!" : "Please bring your own gear!"}
              </Text>
            </View>
            <Divider />

            <Text style={styles.subTitle}>Reviews</Text>
            {reviews.length != 0 ? (
              <ScrollView
                onTouchStart={() => setDragging(false)}
                onTouchEnd={() => setDragging(true)}
                onTouchCancel={() => setDragging(true)}
              >
                {reviews.map((review: PinReview) => (
                  <ReviewCard review={review} key={review.key} />
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.text}>
                No reviews yet... want to add the first one?
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
    margin: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  buttonContainer: {
    flex: 1,
  },
  infoContainer: {
    paddingBottom: 10,
  },
  subTitle: {
    fontSize: 20,
    color: defaultColor,
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

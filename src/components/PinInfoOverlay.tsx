import React, { useCallback, useRef, useState } from 'react';
import { 
  Platform, Animated, ScrollView, StyleSheet,
  useWindowDimensions, View, Dimensions,
  PanResponderGestureState, NativeSyntheticEvent,
  NativeScrollEvent, FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Chip, Divider } from "react-native-elements";
import SlidingUpPanel, { SlidingUpPanelAnimationConfig } from 'rn-sliding-up-panel';

const ios = Platform.OS === 'ios';


function PinInfoOverlay(prop) {
  const pin = prop.pin;
  const navigation = prop.navigation;

  // strange calculation here to get the top of the draggable range correct
  // 35 accounts for the nav bar
  const insets = useSafeAreaInsets();
  const statusBarHeight: number = ios ? insets.bottom : insets.top;
  const deviceHeight = useWindowDimensions().height - statusBarHeight - 100
  const draggableRange = {
    top: deviceHeight - statusBarHeight,
    bottom: deviceHeight / 5
  };

  const snappingPoints = [
    draggableRange.top,
    draggableRange.bottom
  ];

  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [allowDragging, setAllowDragging] = useState(true);
  const [atTop, setAtTop] = useState(true);

  const panelRef = useRef<SlidingUpPanel | null>(null);

  const [panelPositionVal] = useState(new Animated.Value(draggableRange.bottom));

  const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
    },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d721",
    title: "Third Item",
    },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d722",
    title: "Third Item",
    },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d723",
    title: "Third Item",
    },
   {
    id: "58694a0f-3da1-471f-bd96-145571e29d7235",
    title: "Third Item",
    },
    {
    id: "58694a0f-3da1-471f-bd96-145571e29d72355",
    title: "Third Item",
    },
    {
    id: "58694a0f-3da1-471f-bd96-145571e29d7235534",
    title: "Third Item",
    },
    {
    id: "58694a0f-3da1-471f-bd96-145571e29d723553443",
    title: "Third Item",
    },
    {
    id: "58694a0f-3da1-471f-bd96-145571e29d72355e33e",
    title: "Third Item",
  },
];


const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const renderItem = ({ item }) => <Item title={item.title} />;

  return (
    <SlidingUpPanel
      ref={panelRef}
      animatedValue={panelPositionVal}
      draggableRange={draggableRange}
      snappingPoints={snappingPoints}
      backdropOpacity={0}
      showBackdrop={false}
      height={deviceHeight}
      allowDragging={allowDragging}
      friction={0.999}
    >
      <View style={styles.panelContent}>
        <View style={styles.container}>
        <Text h4>{pin.details.title}</Text>
        <Text>{pin.details.slacklineType} </Text>
        <Text>{pin.details.slacklineLength}m</Text>
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonContainer}>
              <Chip

              title="Check In"
              containerStyle={{ marginRight: 10 }}
              onPress={(e) => console.log("check")}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Chip
              title="Add Review"
              type="outline"
              containerStyle={{ marginHorizontal: 10 }}
              onPress={(e) => {
                navigation.navigate("Add a Review", {
                  pin: pin,
                });
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Chip
              title="Add Photos"
              type="outline"
              containerStyle={{ marginHorizontal: 10 }}
              onPress={(e) => {
                navigation.navigate("Spot Details", {
                  newPin: pin,
                });
              }}
            />
          </View>
        </View>
          <View>
          </View>
          <View>
          <Divider />

          <Text style={styles.reviewTitle}>Reviews</Text>
          <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
        {/* <ScrollView
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={false}
          bounces={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
        >
        </ScrollView> */}
        </View>
      </View>
    </SlidingUpPanel>
  );
};

const styles = StyleSheet.create({
  panelContent: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    margin: 10,
  },
  buttonsContainer: {
    //flex: 1,
    flexDirection: "row",
    // alignItems: "flex-start",
    marginVertical: 10,
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
    color: "#219f94"
  },
  item: {
    //backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  reviewTitle: {
    fontSize: 20,
    color: "#219f94",
    padding: 10
  },
});

export default PinInfoOverlay;
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MapScreen } from "./screens/Map/MapScreen";
import { AddPinScreen } from "./screens/Map/AddPinScreen";
import { ProfileScreen } from "./screens/Profile/ProfileScreen";
import { FriendsScreen } from "./screens/Friends/FriendsScreen";
import { FavouritesScreen } from "./screens/Favourites/FavouritesScreen";
import { CheckInScreen } from "./screens/Map/CheckInScreen";
import { AddReviewScreen } from "./screens/Map/AddReviewScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Tab = createBottomTabNavigator();

const MapStack = createNativeStackNavigator();

function MapStackScreen() {
  return (
    <MapStack.Navigator>
      <MapStack.Screen name="Map" component={MapScreen} />
      <MapStack.Screen name="Spot Details" component={AddPinScreen} />
      <MapStack.Screen name="Check In" component={CheckInScreen} />
      <MapStack.Screen name="Add a Review" component={AddReviewScreen} />
    </MapStack.Navigator>
  );
}

export const NavTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#219f94",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Explore"
        component={MapStackScreen}
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{
          tabBarLabel: "Favourites",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          tabBarLabel: "Friends",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-multiple-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

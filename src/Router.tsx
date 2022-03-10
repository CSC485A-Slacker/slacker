import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MapScreen } from "./screens/Map/MapScreen";
import {LoginScreen}   from "./screens/Login/LoginScreen";
import { PinDetailsScreen } from "./screens/Map/PinDetailsScreen";
import { ProfileScreen } from "./screens/Profile/ProfileScreen";
import { FriendsScreen } from "./screens/Friends/FriendsScreen";
import { FavouritesScreen } from "./screens/Favourites/FavouritesScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Tab = createBottomTabNavigator();

const MapStack = createNativeStackNavigator();

const MainStack = createNativeStackNavigator();

export const MainStackScreen = () => {
    return(
    <MainStack.Navigator
        screenOptions={{
            headerShown: false,
        }}>
        <MainStack.Screen name="Login" component = {LoginScreen} options={{ headerLeft: ()=> null, headerBackVisible: false }}/>
        <MainStack.Screen name="Main" component={NavTabs}  options={{ headerLeft: ()=> null, headerBackVisible: false }}/>
    </MainStack.Navigator>
    );
}

function MapStackScreen() {
  return (
    <MapStack.Navigator>
      <MapStack.Screen name="Map" component={MapScreen} />
      <MapStack.Screen name="Spot Details" component={PinDetailsScreen} />
    </MapStack.Navigator>
  );
}

function NavTabs (){
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

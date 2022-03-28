import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MapScreen } from "./screens/Map/MapScreen";
import { PinDetailsScreen } from "./screens/Map/PinDetailsScreen";
import { LoginScreen } from "./screens/Login/LoginScreen";
import { ProfileScreen } from "./screens/Profile/ProfileScreen";
import { FriendsScreen } from "./screens/Friends/FriendsScreen";
import { FavouritesScreen } from "./screens/Favourites/FavouritesScreen";
import { AddReviewScreen } from "./screens/Map/AddReviewScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CheckInDetailsScreen } from "./screens/Map/CheckInDetailsScreen";
import { AddPhotoScreen } from "./screens/Map/AddPhotoScreen";
import { RegisterScreen } from "./screens/Login/RegisterScreen";
import { HomeScreen } from "./screens/Home/HomeScreen";
import { defaultColor } from "./style/styles";
import { SearchFriendsScreen } from "./screens/Friends/SearchScreen";

const Tab = createBottomTabNavigator();

const MapStack = createNativeStackNavigator();

const MainStack = createNativeStackNavigator();

const FriendsStack = createNativeStackNavigator();

export const MainStackScreen = () => {
    return(
    <MainStack.Navigator
        screenOptions={{
            headerShown: true,
        }}>
        <MainStack.Screen name="Home" component = {HomeScreen} options={{ headerLeft: ()=> null, headerShown: false, headerBackVisible: false }}/>
        <MainStack.Screen name="Login" component = {LoginScreen} options={{ headerLeft: ()=> null, headerShown: false, headerBackVisible: false }}/>
        <MainStack.Screen name="Register" component = {RegisterScreen} options={{ headerLeft: ()=> null, headerBackVisible: true }}/>
        <MainStack.Screen name="Main" component={NavTabs}  options={{ headerLeft: ()=> null, headerShown: false, headerBackVisible: false }}/>
    </MainStack.Navigator>
    );
}

function MapStackScreen() {
  return (
    <MapStack.Navigator>
      <MapStack.Screen name="Map" component={MapScreen} options={{title: ''}} />
      <MapStack.Screen name="Spot Details" component={PinDetailsScreen} />
      <MapStack.Screen name="Check-In Details" component={CheckInDetailsScreen} />
      <MapStack.Screen name="Add a Review" component={AddReviewScreen} />
      <MapStack.Screen name="Add a Photo" component={AddPhotoScreen} />
    </MapStack.Navigator>
  );
}

function FriendsStackScreen() {
  return (
    <MapStack.Navigator>
      <MapStack.Screen name="All Friends" component={FriendsScreen} options={{ title: "" }} />
      <MapStack.Screen name="Search Friends" component={SearchFriendsScreen} options={{ title: "" }} />
    </MapStack.Navigator>
  );
}

function NavTabs (){
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: defaultColor,
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
        component={FriendsStackScreen}
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

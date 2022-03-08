import { Text, View } from "react-native";
import Cards from "../../components/DetailsSheet";
import BottomDrawer from "react-native-bottom-drawer-view";

export const FriendsScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Friends is under construction!</Text>
      <Text>No friends yet 😢</Text>

      <BottomDrawer containerHeight={400} offset={49}>
        <Cards />
      </BottomDrawer>
    </View>
  );
};

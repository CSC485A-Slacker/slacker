import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { auth } from "../../config/FirebaseConfig";
import { defaultStyles } from "../../style/styles";

export const HomeScreen = ({ navigation }) => {
  // navigate to main screen if user is logged in
  useEffect(() => {
    setTimeout(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          navigation.navigate("Main");
        } else {
          navigation.navigate("Login");
        }
      });
    }, 2000);
  }, []);
  return (
    <View style={styles.container}>
      <Image
        source={{
          width: 200,
          height: 200,
          uri: "https://github.com/CSC485A-Slacker/slacker/raw/main/Slacker-Logo.png",
        }}
      />
      <Text style={defaultStyles.title} h3>
        Slacker!
      </Text>
      <Text style={defaultStyles.subTitle}>
        Connecting slackliners one line at a time
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});

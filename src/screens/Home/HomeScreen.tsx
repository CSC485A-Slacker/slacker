import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { auth } from "../../config/FirebaseConfig";

export const HomeScreen=({navigation}) => {
  // navigate to main screen if user is logged in
  useEffect(() => {
    setTimeout( () => {
      auth.onAuthStateChanged(user => {
        if (user) {
          navigation.navigate("Main");
        }
        else
        {
            navigation.navigate("Login")
        }
      })
    }, 2000)
  }, [])
  return (
    <View style={styles.container}>
      <Text style={{ color: "white" }}>
        Welcome to Slacker! A slackliner's everyday solution!
      </Text>
      <Image
        source={{
          width: 200,
          height: 200,
          uri: "https://github.com/CSC485A-Slacker/slacker/raw/main/Slacker_logo.png",
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
});

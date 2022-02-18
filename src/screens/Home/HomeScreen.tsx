import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
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

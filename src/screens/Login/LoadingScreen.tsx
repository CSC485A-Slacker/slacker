import React, { Component } from "react";
import 
{
    View,
    Text,
    StyleSheet
} from "react-native"
import  { getAuth, onAuthStateChanged } from '@firebase/auth';

export const LoadingScreen = ({ route, navigation })  => 

{
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;
          navigation.navigate("Map")
          // ...
        } else {
          navigation.navigate("Login")
        }
      });
      return (
        <View></View>
      )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
  });
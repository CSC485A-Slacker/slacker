import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Text } from "react-native-elements";
import {
  backgroundColor,
  defaultColor,
  defaultStyles,
} from "../../style/styles";
import { auth } from "../../config/FirebaseConfig";
import { useToast } from "react-native-toast-notifications";

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  const handleSignUp = () => {
    navigation.navigate("Register");
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email.trimEnd(), password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        navigation.push("Main")
      })
      .catch((error) => {
          const errorCode = error.code;
          let userErrorMessage = "Login failed";
        
        console.log(`error logging in: ${errorCode}`);

        switch(errorCode) {
            case "auth/invalid-email":
                userErrorMessage = "Invalid email";
                if(email.trimEnd() == "") userErrorMessage = "Email required"
                break;
            case "auth/wrong-password":
                userErrorMessage = "Wrong password";
                break;
            case "auth/user-not-found":
                userErrorMessage = "Account not registered";
                break;
            default:
                userErrorMessage = "Login failed";
                if(password == "") userErrorMessage = "Password required"
        }

        toast.show(`Whoops! ${userErrorMessage}.`, {
            type: "danger",
        });
      } );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Image
        source={{
          width: 200,
          height: 200,
          uri: "https://github.com/CSC485A-Slacker/slacker/raw/main/Slacker-Logo.png",
        }}
      />
      <Text style={defaultStyles.title} h3>
        Welcome to Slacker!
      </Text>
      <Text style={defaultStyles.subTitle}>
        A slackliner's everyday solution
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignUp} style={[styles.buttonOutline]}>
          <Text style={styles.buttonTextRegister}>Not a user? Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: defaultColor,
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: backgroundColor,
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonTextRegister: {
    color: defaultColor,
    fontWeight: "700",
    fontSize: 14,
  },
});

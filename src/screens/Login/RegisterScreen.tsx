import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/FirebaseConfig";
import { Database } from "../../data/Database";
import { User } from "../../data/User";
import { defaultColor } from "../../style/styles";
import { useToast } from "react-native-toast-notifications";

export const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const toast = useToast();
  const db = new Database();

  const handleSignUp = async () => {
    try {
      const allUsers = await db.getAllUsers();
      
      if (allUsers.data != undefined) {
        allUsers.data?.forEach((user) => {
          if (user._username == username) {
            toast.show("Whoops! Username already exists", {
                type: "danger",
            });
            throw new Error("Username already exists");
          }
        });
      }
      else {
          toast.show("Whoops! We had an issue on our end. Try again later.", {
                type: "danger",
            });
          throw new Error("Could not get users list.")
      }

      createUserWithEmailAndPassword(auth, email.trimEnd(), password)
      .then(async (userCredentials) => {
        const user = userCredentials.user;
        db.addUser(new User(user.uid, null, new Date(), username, []));
        navigation.push("Main")
      })
      .catch((error) => {
          const errorCode = error.code;
          let userErrorMessage = "Register failed";
        
        console.log(`error logging in: ${errorCode}`);

        switch(errorCode) {
            case "auth/invalid-email":
                userErrorMessage = "Invalid email";
                if(email.trimEnd() == "") userErrorMessage = "Enter an email"
                break;
            case "auth/weak-password":
                userErrorMessage = "Weak password";
                break;
            default:
                userErrorMessage = "Register failed";
                if(password == "") userErrorMessage = "Enter a password"
        }

        toast.show(`Whoops! ${userErrorMessage}.`, {
            type: "danger",
        });
      } );

    } catch (error) {
        console.log(`Error creating user: ${error}`);
      return;
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Username"
          value={username}
          autoCapitalize="none"
          onChangeText={(text) => setUsername(text)}
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
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
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
    backgroundColor: "white",
    marginTop: 5,
    borderColor: defaultColor,
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: defaultColor,
    fontWeight: "700",
    fontSize: 16,
  },
});

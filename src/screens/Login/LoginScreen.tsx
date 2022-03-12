import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Text } from "react-native-elements";
import { auth  } from '../../config/FirebaseConfig'
import { Database } from '../../data/Database';
import { User } from '../../data/User';
import { defaultColor, greyColor } from '../Map/MapScreen';

export const LoginScreen = ({navigation}) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const db = new Database()

  // navigate to main screen if user is logged in
  useEffect( () => {
    const user = auth.currentUser;
    console.log(`user in login: ${user}`);
    if(auth.currentUser) {
        navigation.navigate("Main");
    }
  },);

  
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.navigate("Main");
      }
    })

    return unsubscribe
  }, [])

  const handleSignUp = () => {

      createUserWithEmailAndPassword(auth, email, password)
      .then(async userCredentials => {
        const user = userCredentials.user;
        db.addUser(new User(user.uid, 0))
      })
      .catch(error => alert(error.message))
  }

  const handleLogin = () => {
    
      signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        navigation.navigate("Main")
      })
      .catch(error => alert(error.message))
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <Image
        source={{
          width: 200,
          height: 200,
          uri: "https://github.com/CSC485A-Slacker/slacker/raw/main/Slacker-Logo.png",
        }}
      />
      <Text style={styles.title} h3>
        Welcome to Slacker!
      </Text>
      <Text style={styles.subTitle}>
         A slackliner's everyday solution
      </Text>
      <View style={styles.inputContainer}>
        
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: defaultColor,
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: defaultColor,
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: defaultColor,
    fontWeight: '700',
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    color: defaultColor,
  },
  subTitle: {
    color: greyColor,
    paddingTop: 10,
    paddingBottom: 20,
    fontSize: 16,
  },
})
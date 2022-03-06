import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { getAuth, GoogleAuthProvider, signInWithCredential } from '@firebase/auth';


WebBrowser.maybeCompleteAuthSession();

export function LoginScreen() {

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
        {
          clientId: '973038675029-ngtkltsd00nbr8gcek30up387e197h04.apps.googleusercontent.com',
          },
      );
    
      React.useEffect(() => {
        if (response?.type === 'success') {
          const { id_token } = response.params;
          
          const auth = getAuth();
          const provider = new GoogleAuthProvider();
          const credential = provider.credential(id_token);
          signInWithCredential(auth, credential);
        }
      }, [response]);
    
      return (
        <Button
          disabled={!request}
          title="Login"
          onPress={() => {
            promptAsync();
            }}
        />
      );
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
  });
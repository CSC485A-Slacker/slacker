import { signOut } from "firebase/auth";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { auth } from "../../config/FirebaseConfig";
import { MapStackScreen } from "../../Router";

export const ProfileScreen = ({navigation}) => {
    const user = auth.currentUser

    const handleLogout = () => {
      signOut(auth)
      .then(navigation.navigate("Login"))
      .catch(error => alert(error.message));
  }

  return (
    <View style={styles.container}>
        <Text>Profile is under construction!</Text>
      <Text></Text>
      <Text>Email: {auth.currentUser?.email}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
        onPress={handleLogout}
        style={styles.button}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  }
})

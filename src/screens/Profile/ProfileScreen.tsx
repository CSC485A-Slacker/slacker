import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { auth } from "../../config/FirebaseConfig";
import { Database } from "../../data/Database";
import { defaultColor } from "../../style/styles";
import { useToast } from "react-native-toast-notifications";

export const ProfileScreen = ({ navigation }) => {
  const db = new Database();
  const [email, setEmail] = useState(auth.currentUser?.email);
  const [username, setUsername] = useState(auth.currentUser?.email);
  const toast = useToast();
  
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDB = await db.getUser(user.uid);
        setUsername(userDB.data?._username);
        setEmail(auth.currentUser?.email);
      }
    });
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(navigation.navigate("Login"))
      .catch((error) => {
          toast.show(`Whoops! There was an issue logging out.`, {
            type: "danger",
        });
      });
  };

  return (
    <View style={styles.container}>
      <Text>Email: {email}</Text>
      <Text>Username: {username}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});

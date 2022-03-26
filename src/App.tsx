import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MainStackScreen } from "./Router";
import { store } from "./redux/Store";
import { Provider } from "react-redux";
import { timedBackground } from "./data/Tasks";
import { Database } from "./data/Database";

const database = new Database();

export default function App() {
    // database.checkoutAllExpiredCheckinsTask(1);
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <MainStackScreen />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

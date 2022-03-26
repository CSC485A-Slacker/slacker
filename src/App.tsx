import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MainStackScreen } from "./Router";
import { store } from "./redux/Store";
import { Provider } from "react-redux";
import { timedBackground } from "./data/Tasks";
import { Database } from "./data/Database";

const database = new Database();

import { LogBox } from "react-native";

export default function App() {
  // hides yellow box warnings on screen - useful for demos
  // LogBox.ignoreAllLogs() 

  // runs checkout task every n minutes
  // database.checkoutAllExpiredCheckinsTask(1);

  // runs checkout task on load
  // database.checkoutAllExpiredCheckins();
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

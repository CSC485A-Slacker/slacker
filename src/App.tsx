import { TestAll } from './tests/Database';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavTabs } from "./Router";
import { store } from "./redux/Store";
import { Provider } from "react-redux";

export default function App() {
    TestAll();

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <NavTabs />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

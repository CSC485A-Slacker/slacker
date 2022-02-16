import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavTabs } from "./Router";

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <NavTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

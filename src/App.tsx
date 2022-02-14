import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { NavTabs } from './Router';

const newColorTheme = {
  brand: {
    900: '#8287af',
    800: '#7c83db',
    700: '#b3bef6',
  },
};
const theme = extendTheme({ colors: newColorTheme });

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <NavTabs/>
      </NavigationContainer>
    </NativeBaseProvider>
    
  );
}

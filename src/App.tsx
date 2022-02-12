import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NavTabs } from './Router';


export default function App() {
  return (
    <NavigationContainer>
      <NavTabs/>
    </NavigationContainer>
  );
}

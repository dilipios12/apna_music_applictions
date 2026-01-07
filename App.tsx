import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import BottomTabs from "./componet/navigation/Navigations";
// import AppNavigation from "./componet/AppNavigation/AppNavigation"
import AppNavigation from "./componet/navigation/AppNavigation"
// import WelcomePages from './componet/Pages/WelcomePages/LoginPages';
export default function App() {


  return (
    // <NavigationContainer>
    <AppNavigation/>
    // </NavigationContainer>
  );
}

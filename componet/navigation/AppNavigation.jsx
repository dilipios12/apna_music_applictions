import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import LoginPages from "../Pages/WelcomePages/LoginPages";
import RegisterPages from "../Pages/RegisterPages/RegisterPages";
import BottomTabs from "../navigation/Navigations";
import VerificationScreen from "../Pages/Verification Screen/VerificationScreen";
import MobileNumberScreen from "../Pages/MobileNumberScreen/MobileNumberScreen";
import ChangePassword from "../Pages/ChangePassword/ChangePassword";
const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* FIRST SCREEN */}
        <Stack.Screen name="Login" component={LoginPages} />
        <Stack.Screen name="Register" component={RegisterPages} />
       <Stack.Screen name="Verification" component={VerificationScreen}/>
       <Stack.Screen name="mobilenumber" component={MobileNumberScreen}/>
              <Stack.Screen name="changePassword" component={ChangePassword}/>


       
        {/* AFTER LOGIN → ENTER MAIN APP */}
        <Stack.Screen name="MainTabs" component={BottomTabs} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

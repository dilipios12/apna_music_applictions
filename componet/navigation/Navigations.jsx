import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { View, StyleSheet } from "react-native";

// Main App Screens
import HomeScreen from "../Pages/Home/Home";
import SearchScreen from "../Pages/SearchScreen/SearchScreen";
import LibraryScreen from "../Pages/LibraryScreen/LibraryScreen";
import ProfileScreen from "../Pages/ProfileScreen/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,

        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === "Home")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Search")
            iconName = focused ? "musical-notes" : "musical-notes-outline";
          else if (route.name === "Library")
            iconName = focused ? "heart" : "heart-outline";
          else if (route.name === "Profile")
            iconName = focused ? "person" : "person-outline";

          return (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <Ionicons
                name={iconName}
                size={26}
                color={focused ? "#FF5B77" : "#AAA"}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 15,
    left: 20,
    right: 20,
    height: 65,
    borderRadius: 30,
    backgroundColor: "#1C1833",
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: "#FF5B77",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 55,
    height: 45,
    borderRadius: 25,
  },
  activeIcon: {
    backgroundColor: "rgba(255, 91, 119, 0.15)",
  },
});

// import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
// import React from 'react'
// import { useNavigation } from '@react-navigation/native'
// const LoginPages = () => {
// const navigation = useNavigation();



// const handelSingup=()=>{
//   navigation.navigate("home")
// }

//   return (
//     <View style={styles.container}>

//       {/* TOP IMAGE */}
//       <Image
//         source={require("../../../assets/images/istockphoto-501599463-612x612.jpg")}
//         style={styles.topImage}
//         resizeMode="cover"
//       />

//       {/* TITLE */}
//       <Text style={styles.appTitle}>Loop Music</Text>

//       {/* DESCRIPTION */}
//       <Text style={styles.description}>
//         Loop Music is the best music streaming app to enjoy great music. Play any song of your favorite artist, album or playlist in high quality.
//       </Text>

//       {/* BUTTONS */}
//       <TouchableOpacity style={styles.signUpBtn} onPress={handelSingup}>
//         <Text style={styles.signUpText}>Sign Up</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.signInBtn}>
//         <Text style={styles.signInText}>Sign In</Text>
//       </TouchableOpacity>

//     </View>
//   )
// }

// export default LoginPages;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#0B0820",
//     alignItems: "center",
//   },

//   topImage: {
//     width: "100%",
//     height: 430,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//   },

//   appTitle: {
//     fontSize: 50,
//     color: "#fff",
//     fontWeight: "bold",
//     marginTop: 20,
//     fontFamily: "cursive",
//   },

//   description: {
//     color: "gray",
//     fontSize: 14,
//     textAlign: "center",
//     width: "85%",
//     marginTop: 10,
//     lineHeight: 20,
//   },

//   signUpBtn: {
//     width: "70%",
//     height: 50,
//     backgroundColor: "#FF8C4A",
//     borderRadius: 30,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 40,
//   },

//   signUpText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 16,
//   },

//   signInBtn: {
//     width: "70%",
//     height: 50,
//     borderRadius: 30,
//     borderWidth: 1,
//     borderColor: "#FF8C4A",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 15,
//   },

//   signInText: {
//     color: "#FF8C4A",
//     fontWeight: "600",
//     fontSize: 16,
//   },
// });

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import React,{useState,useEffect} from "react";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";


const LoginPages = () => {
  const navigation = useNavigation();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = useState(false);

  const handelonpresslogin = async () => {
    setLoading(true);
    // VALIDATION
    // VALIDATION
    if (!password || !email) {
      Toast.show({
        type: "error",
        text1: "All fields are required!",
        text2: "Please fill in all fields before proceeding",
      });
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      Toast.show({
        type: "error",
        text1: "Weak Password!",
        text2: "Password must be at least 8 characters long",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.18.224:5000/api/auth/loginusers-palylist",
        {
        email,
          password,
        }
      );

      if (response.status === 201 || response.status === 200) {
        Toast.show({
          type: "success",
          text1: "login successful",
        });

        // RESET FIELDS

        setEmail("");

        setPassword("");

        setTimeout(() => {
          setLoading(false);
          navigation.navigate("MainTabs")

        }, 1000);
      } else {
        Toast.show({
          type: "error",
          text1: "Login failed!",
        });
      }

      setLoading(false);
    } catch (error) {
      console.log("Login error:", error.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: "Login failed!",
        text2: error.response?.data?.message || "Something went wrong",
      });
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          
          <Animatable.Image
            source={require("../../../assets/images/istockphoto-501599463-612x612.jpg")}
            style={styles.topImage}
            resizeMode="cover"
              animation="fadeInDown"
        duration={1500}
          />

          <Animatable.Text style={styles.appTitle} animation="fadeInUp" delay={200}>Loop Music</Animatable.Text>

          <Animatable.Text style={styles.description} animation="fadeInUp" delay={200}>
            Loop Music is the best music streaming app to enjoy great music.
            Play any song of your favorite artist, album or playlist.
          </Animatable.Text>

          {/* Email Box */}
          <Animatable.View style={styles.inputWrapper} animation="fadeInUp" delay={300}>
            <TextInput
              style={styles.input}
              placeholder="youremail@example.com"
              placeholderTextColor="#d7ccc8"
              value={email}
              onChangeText={setEmail}
            />
            <Icon name="checkmark-circle-outline" size={22} color="#ffb74d" />
          </Animatable.View>

          {/* Password Box */}
          <Animatable.View style={styles.inputWrapper} animation="fadeInUp" delay={300}>
            <TextInput
              style={styles.input}
              placeholder="Enter your Password"
              placeholderTextColor="#d7ccc8"
              value={password}
              secureTextEntry={true}
              onChangeText={setPassword}
            />
            <Icon name="checkmark-circle-outline" size={22} color="#ffb74d" />
          </Animatable.View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.signUpBtn}
            onPress={handelonpresslogin}
          >
            <Text style={styles.signUpText}>Sign In</Text>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity
            style={styles.signInBtn}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.signInText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Forgot Password */}
        <View style={styles.loginLine}> <Text style={{ color: "#fff" }}>Already have an account? </Text> <TouchableOpacity onPress={() => navigation.navigate("mobilenumber")} > <Text style={styles.loginLink}>Forgrt Password</Text> </TouchableOpacity> </View>

          <Toast />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginPages;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "#0B0820",
    alignItems: "center",
    paddingBottom: 40,
  },

  topImage: {
    width: "100%",
    height: 300,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  appTitle: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 20,
    fontFamily: "cursive",
    textAlign: "center",
  },

  description: {
    color: "gray",
    fontSize: 14,
    textAlign: "center",
    width: "90%",
    marginTop: 10,
    lineHeight: 20,
  },

  inputWrapper: {
    backgroundColor: "#4a342e",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 20,
    width: "90%",
    borderWidth: 1,
    borderColor: "#ffb74d",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  input: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
  },

  signUpBtn: {
    width: "80%",
    height: 50,
    backgroundColor: "#FF8C4A",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },

  signUpText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  signInBtn: {
    width: "80%",
    height: 50,
    borderColor: "#FF8C4A",
    borderWidth: 1,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  signInText: {
    color: "#FF8C4A",
    fontSize: 16,
    fontWeight: "600",
  },

  loginLine: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },

  loginLink: {
    color: "#ffb74d",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});





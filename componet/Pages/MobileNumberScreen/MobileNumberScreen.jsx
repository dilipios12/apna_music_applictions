import { View, Text, TextInput, StyleSheet, TouchableOpacity,KeyboardAvoidingView,ScrollView } from "react-native";
import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
const MobileNumberScreen = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
const [loading,setLoading]=useState("");
  // const handleSendOtp = () => {
  //   console.log("Sending OTP to:", number);

  //   // API CALL HERE (Send OTP)
  //   // axios.post("/forgot", { phone_number: number })

  //   navigation.navigate("Verification",);
  // };




const handleSendOtp = async () => {
  setLoading(true);

  if (!email) {
    Toast.show({
      type: "error",
      text1: "Email field is required!",
      text2: "Please fill it before proceeding",
    });
    setLoading(false);
    return;
  }


         await AsyncStorage.setItem("email", (email));

  try {
    const response = await axios.post(
      "http://192.168.18.224:5000/api/auth/sendtheotp",
      { email }
    );
    // 🔥 SHOW API MESSAGE HERE
    Toast.show({
      type: "success",
      text1: response.data.message || "OTP sent successfully",
    });

    // RESET
    setEmail("");

    setTimeout(() => {
      setLoading(false);
      navigation.navigate("Verification");
    }, 800);

  } catch (error) {
    console.log("OTP Error:", error.response?.data || error.message);

    // 🔥 Show Backend Error Response Message
    Toast.show({
      type: "error",
      text1: "Failed to send OTP!",
      text2: error.response?.data?.error || error.response?.data?.message || "Something went wrong",
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
      {/* Animation Image */}
      <Animatable.Image
        animation="fadeInDown"
        duration={1500}
        source={require("../../../assets/images/pngtree.png")}
        style={styles.image}
      />

      <Animatable.Text animation="fadeInUp" style={styles.title}>
        Forgot Password 
      </Animatable.Text>

      <Animatable.Text animation="fadeInUp" delay={200} style={styles.subtitle}>
        Enter your Email address to receive an OTP.
      </Animatable.Text>

      {/* Input Field */}
      <Animatable.View animation="fadeInUp" delay={300} style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="Enter Email Address"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          value={email}
          onChangeText={setEmail}
        />
      </Animatable.View>

      {/* Send OTP Button */}
      <Animatable.View animation="zoomIn" delay={400}>
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={handleSendOtp}
        >
          <Text style={styles.sendText}>Send OTP</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
          </ScrollView>
          <Toast />
                </KeyboardAvoidingView>

  );
};

export default MobileNumberScreen;

const styles = StyleSheet.create({
      scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#0B0820",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius:10
  },

  title: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
  },

  subtitle: {
    color: "#b8b8b8",
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  inputBox: {
    width: "90%",
  },

  input: {
    backgroundColor: "#1A1735",
    padding: 15,
    color: "#fff",
    borderRadius: 10,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#4F4C97",
  },

  sendBtn: {
    backgroundColor: "#5A4FF3",
    paddingVertical: 14,
    paddingHorizontal: 120,
    borderRadius: 15,
    marginTop: 25,
    opacity: 1,
  },

  sendText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

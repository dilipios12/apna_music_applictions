import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, ScrollView, Platform
} from "react-native";
import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ChangePassword = () => {

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();

  const handleSendOtp = async () => {

    if (!newPassword || !confirmPassword) {
      return Toast.show({
        type: "error",
        text1: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return Toast.show({
        type: "error",
        text1: "Passwords do not match",
      });
    }

    try {
      const emailss = await AsyncStorage.getItem("email");

      const res = await axios.post(
        "http://192.168.18.224:5000/api/auth/reset-password-song",
        {
          email: emailss,
          newPassword: newPassword,
        }
      );

      Toast.show({
        type: "success",
        text1: res.data.message || "Password Changed Successfully",
      });

      setNewPassword("");
      setConfirmPassword("");

      navigation.navigate("Login");

    } catch (err) {
      Toast.show({
        type: "error",
        text1: err.response?.data?.message || "Failed to change password",
      });
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
            animation="fadeInDown"
            duration={1500}
            source={require("../../../assets/images/ook.png")}
            style={styles.image}
          />

          <Animatable.Text animation="fadeInUp" style={styles.title}>
            Change Password
          </Animatable.Text>

          {/* New Password */}
          <Animatable.View animation="fadeInUp" delay={300} style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Enter New Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </Animatable.View>

          {/* Confirm Password */}
          <Animatable.View animation="fadeInUp" delay={300} style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </Animatable.View>

          {/* Button */}
          <Animatable.View animation="zoomIn" delay={400}>
            <TouchableOpacity style={styles.sendBtn} onPress={handleSendOtp}>
              <Text style={styles.sendText}>Change Password</Text>
            </TouchableOpacity>
          </Animatable.View>

        </View>
      </ScrollView>

      <Toast />
    </KeyboardAvoidingView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: {
    flex: 1,
    backgroundColor: "#0B0820",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 350,
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
  },
  inputBox: {
    width: "90%",
    marginVertical: 10,
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
    paddingVertical: 15,
    paddingHorizontal: 110,
    borderRadius: 15,
    marginTop: 25,
  },
  sendText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

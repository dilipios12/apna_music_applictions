import { 
  View, Text, StyleSheet, Image, TouchableOpacity, 
  ScrollView, KeyboardAvoidingView, Platform 
} from "react-native";
import React, { useState, useRef } from "react";
import * as Animatable from "react-native-animatable";
import OTPTextInput from "react-native-otp-textinput";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";


const VerificationScreen = () => {

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(50);
  const [loading, setLoading] = useState(false);

  const otpInput = useRef(null);
  const navigation = useNavigation();

  // Timer countdown
  React.useEffect(() => {
    let interval = setInterval(() => {
      if (timer > 0) setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ------------ VERIFY OTP API ------------
  const handleVerify = async () => {
    if (otp.length < 6) {
      return Toast.show({
        type: "error",
        text1: "Please enter valid OTP",
      });
    }
     const emailss = await AsyncStorage.getItem("email");
    try {
      setLoading(true);
      const res = await axios.post("http://http://192.168.18.224:5000/api/auth/verify-emailOTP", {
        email:emailss,
        otp,
      });
     setOtp("")
      Toast.show({
        type: "success",
        text1: res.data.message,
      });

      navigation.navigate("changePassword"); // 🔥 SUCCESS NAVIGATION

    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Invalid OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  // ------------ RESEND OTP API ------------
const resendOtp = async () => {
 
  try {
    setTimer(30);

    const emailss = await AsyncStorage.getItem("email");
console.log(emailss)
    const res = await axios.post(
      "http://192.168.18.224:5000/api/auth/resend-otp-email",
      { email: emailss }
    );

    Toast.show({
      type: "success",
      text1: res.data.message || "OTP sent again",
    });

    if (otpInput.current) {
      otpInput.current.setValue("");   // FIXED
    }
    setOtp("");

  } catch (err) {
    Toast.show({
      type: "error",
      text1: "Failed to resend OTP",
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

          {/* Animated Image */}
          <Animatable.Image
            animation="fadeInDown"
            duration={1500}
            source={require("../../../assets/images/otp-code.png")}
            style={styles.image}
            resizeMode="contain"
          />

          {/* Title */}
          <Animatable.Text animation="fadeInUp" style={styles.title}>
            OTP Verification
          </Animatable.Text>

          {/* Subtitle */}
          <Animatable.Text animation="fadeInUp" delay={200} style={styles.subtitle}>
            Enter the 6-digit OTP sent to your number
          </Animatable.Text>

          {/* OTP Boxes */}
          <Animatable.View animation="fadeInUp" delay={400} style={{ marginTop: 20 }}>
            <OTPTextInput
              ref={otpInput}
              inputCount={6}
              handleTextChange={(code) => setOtp(code)}
              containerStyle={styles.otpContainer}
              textInputStyle={styles.otpInput}
            />
          </Animatable.View>

          {/* Verify Button */}
          <Animatable.View animation="zoomIn" delay={600} style={{ marginTop: 30 }}>
            <TouchableOpacity
              style={styles.verifyBtn}
              onPress={handleVerify}
              disabled={loading}
            >
              <Text style={styles.verifyText}>
                {loading ? "Verifying..." : "Verify OTP"}
              </Text>
            </TouchableOpacity>
          </Animatable.View>

          {/* Resend OTP */}
          <View style={styles.resendBox}>
            {timer > 0 ? (
              <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
            ) : (
              <TouchableOpacity onPress={resendOtp}>
                <Text style={styles.resendText}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>

        </View>
      </ScrollView>
      <Toast />
    </KeyboardAvoidingView>
  );
};

export default VerificationScreen;

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
    width: 450,
    height: 330,
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 16,
    color: "#b8b8b8",
    textAlign: "center",
    width: 280,
  },

  otpContainer: {
    width: "80%",
  },

  otpInput: {
    backgroundColor: "#1A1735",
    color: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4F4C97",
    fontSize: 20,
  },

  verifyBtn: {
    backgroundColor: "#5A4FF3",
    paddingVertical: 14,
    paddingHorizontal: 100,
    borderRadius: 15,
  },

  verifyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  resendBox: {
    marginTop: 20,
  },

  timerText: {
    color: "#b5b5b5",
    fontSize: 16,
  },

  resendText: {
    color: "#6D5DFB",
    fontSize: 16,
    fontWeight: "bold",
  },
});

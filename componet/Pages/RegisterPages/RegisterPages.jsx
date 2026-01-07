import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,KeyboardAvoidingView,
  StyleSheet,
  Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import Toast from "react-native-toast-message";
import * as Animatable from "react-native-animatable";

const RegisterPages = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handelRegister = () => {
    navigation.navigate("Login");
  };

  const onpressregister = async () => {
    setLoading(true);

    // VALIDATION
  // VALIDATION
  if (!username || !email || !phone_number || !password) {
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
        "http://192.168.18.224:5000/api/auth/regsiter-users",
        {
          username,
          email,
          phone_number,
          password,
        }
      );

      if (response.status === 201 || response.status === 200) {
        Toast.show({
          type: "success",
          text1: "Registration successful",
        });

        // RESET FIELDS
        setUsername("");
        setEmail("");
        setPhone_number("");
        setPassword("");

        setTimeout(() => {
          setLoading(false);
          navigation.navigate("Login");
        }, 1000);
      } else {
        Toast.show({
          type: "error",
          text1: "Registration failed!",
        });
      }

      setLoading(false);
    } catch (error) {
      console.log("Registration error:", error.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: "Registration failed!",
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
      <View style={styles.topRow}>
        <TouchableOpacity onPress={handelRegister}>
        <Icon name="close" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.laterText}>Later</Text>
      </View>

      <Text style={styles.title}>Get Started</Text>
      <View style={{ height: 30 }}></View>

      {/* NAME INPUT */}
      <Animatable.View style={styles.inputWrapper} animation="fadeInUp" delay={300}>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          placeholderTextColor="#d7ccc8"
          value={username}
          onChangeText={setUsername}
        />
        <Icon name="checkmark-circle-outline" size={22} color="#ffb74d" />
      </Animatable.View>

      {/* EMAIL INPUT */}
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

      {/* PHONE NUMBER INPUT */}
      <Animatable.View style={styles.inputWrapper} animation="fadeInUp" delay={300}>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          placeholderTextColor="#d7ccc8"
          keyboardType="number-pad"
          value={phone_number}
          onChangeText={setPhone_number}
        />
        <Icon name="call-outline" size={22} color="#ffb74d" />
      </Animatable.View>

      {/* PASSWORD INPUT */}
      <Animatable.View style={styles.inputWrapper} animation="fadeInUp" delay={300}>
        <TextInput
          style={styles.input}
          placeholder="Enter your Password"
          placeholderTextColor="#d7ccc8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Icon name="checkmark-circle-outline" size={22} color="#ffb74d" />
      </Animatable.View>

      <Text style={styles.subText}>Must be at least 8 characters!</Text>

      <TouchableOpacity style={{ width: "100%" }} onPress={onpressregister}>
        <LinearGradient colors={["#ff8a65", "#ffb74d"]} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.loginLine}>
        <Text style={{ color: "#fff" }}>Already have an account? </Text>

        <TouchableOpacity onPress={handelRegister}>
          <Text style={styles.loginLink}>Log in</Text>
        </TouchableOpacity>

        
      </View>


<View style={styles.socialRow}>
        <View style={styles.socialBox}>
          <Image
            source={{ uri: "https://img.icons8.com/color/48/google-logo.png" }}
            style={styles.socialIcon}
          />
        </View>
        <View style={styles.socialBox}>
          <Image
            source={{ uri: "https://img.icons8.com/ios-filled/50/mac-os.png" }}
            style={styles.socialIcon}
          />
        </View>
        <View style={styles.socialBox}>
          <Image
            source={{ uri: "https://img.icons8.com/color/48/facebook-new.png" }}
            style={styles.socialIcon}
          />
        </View>
      </View>

            <Toast />

    </View>
         </ScrollView>
          </KeyboardAvoidingView>
  );
};

export default RegisterPages;


const styles = StyleSheet.create({
    scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#0B0820",
    padding: 25,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  laterText: {
    color: "#fff",
    fontSize: 16,
  },
  title: {
    fontSize: 42,
    color: "#fff",
    marginTop: 40,
    fontWeight: "bold",
    fontFamily: "cursive",
  },

  inputWrapper: {
    backgroundColor: "#4a342e",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ffb74d",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  input: {
    color: "#fff",
    fontSize: 15,
    flex: 1,
  },

  subText: {
    color: "#ffccbc",
    marginTop: 5,
    fontSize: 12,
  },

  button: {
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 25,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  line: {
    height: 1,
    backgroundColor: "#795548",
    flex: 1,
  },
  orText: {
    color: "#bbb",
    marginHorizontal: 10,
  },
  signInText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
  },

  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    gap: 20,
  },

  socialBox: {
    backgroundColor: "#4e342e",
    padding: 14,
    borderRadius: 15,
  },

  socialIcon: {
    width: 28,
    height: 28,
  },

 loginLine: {
  flexDirection: "row",
  justifyContent: "center",
  marginTop: 25,
  alignItems: "center",
},

loginLink: {
  color: "#ffb74d",
  fontWeight: "bold",
  textDecorationLine: "underline",
},

});



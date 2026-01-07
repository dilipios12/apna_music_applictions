import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity,Modal } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const ProfileScreen = () => {
  const [recommended, setRecommended] = useState([]);
  const navigation=useNavigation();
   const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    setModalVisible(false);

     Toast.show({
             type: "success",
             text1: "Logout successful",
           });

              // Using an anonymous function:
setTimeout(() => {
              navigation.navigate("Login")
}, 3000);

  };

  const handelClickdata = async (languageId, objectId) => {
    try {
      await AsyncStorage.multiRemove(["language_types_id", "objectId"]);
      await AsyncStorage.setItem("language_types_id", String(languageId));
      await AsyncStorage.setItem("objectId", String(objectId));
      console.log("✅ Stored:", { languageId, objectId });
      navigation.navigate("Search");
    } catch (error) {
      console.error("❌ Error handling AsyncStorage:", error);
    }
  };

  useEffect(() => {
    GetHandelalldata();
  }, []);

  const GetHandelalldata = async () => {
    try {
      const response = await axios.get(
        "http://192.168.18.224:5000/api/auth/all-playlistdata"
      );
      setRecommended(response.data.data);
    } catch (error) {
      console.error("Error fetching all playlist data:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={26} color="#AAA" />
        <Text style={styles.headerTitle}>Profile</Text>
  <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Ionicons name="settings-outline" size={26} color="#AAA" />
      </TouchableOpacity>      
      </View>




      {/* Settings Icon */}
    

      {/* Logout Confirmation Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalBox}>
            {/* <Text style={styles.title}>Logout</Text> */}
               {/* <View style={styles.imagesbox}>
               <Image
            source={require("../../../assets/images/icon-logout-19.jpg")}
          style={styles.logoutImage}
        />
               </View> */}
            <Text style={styles.message}>Are you sure you want to logout?</Text>

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity  
                style={styles.okBtn}
                onPress={handleLogout}
              >
                <Text style={styles.okText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>Sarwar Jahan</Text>
        <Text style={styles.email}>sarwarmusic@gmail.com</Text>
        <Text style={styles.memberType}>Gold Member</Text>
        <Text style={styles.bio}>Love Music and I am not a Musician.</Text>
      </View>

      {/* Favourite Music Section (Only this scrolls) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favourite Music</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.gridContainer}>
              {recommended.map((music) => (
                <TouchableOpacity key={music.id} style={styles.albumBox} 
                       onPress={() => handelClickdata(music.language_types_id, music._id)}     >
                  <Image
                    source={{
                      uri: `http://192.168.18.183:5000/playlist/images/${music.Image}`,
                    }}
                    style={styles.albumImage}
                  />
                  <Text style={styles.albumTitle}>{music.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      <Toast />
    </ScrollView>
  );
};

export default ProfileScreen;


const styles = StyleSheet.create({
imagesbox:{
    alignItems: "center",
    marginVertical: 10,
 
  
  },

logoutImage:{
  height:100,
  width:100,
    justifyContent: "flex-center",
      // textAlign:"center",
     borderWidth: 4,
    borderColor: "#1a1919ff",
    borderRadius:20
},

   modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 25,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign:"center",
    color: "#555",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelBtn: {
   width: "30%",
    height: 50,
    borderColor: "#FF8C4A",
    backgroundColor:"green",
    borderWidth: 1,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 5, 

  },
  cancelText: {
    fontSize: 18,
    color: "black",
  },
  okBtn: {
      width: "30%",
    height: 50,
    borderColor: "#FF8C4A",
    backgroundColor:"#ff4a4aff",
    borderWidth: 1,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 5, 
  },
  okText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#0B0820",
    paddingHorizontal: 15,
    paddingTop: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  profileSection: {
    alignItems: "center",
    marginVertical: 50,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  email: {
    color: "#AAA",
    fontSize: 14,
  },
  memberType: {
    color: "#6C63FF",
    fontSize: 14,
    marginTop: 4,
  },
  bio: {
    color: "#BBB",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    width: "80%",
  },

  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  albumBox: {
    width: "30%",
    backgroundColor: "#1C1632",
    borderRadius: 10,
    padding: 5,
    marginBottom:10 ,
  },

  albumImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },

  albumTitle: {
    color: "#AAA",
    fontSize: 12,
    marginTop: 6,
  },
});

import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const navigation = useNavigation();

  // 🧠 Fetch favorite songs
  const GetHandeldata = async () => {
    try {
      const response = await axios.get(
        "http://192.168.18.224:5000/api/auth/getFavorites",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Fetched Favorite Data:", response.data);
      setFavorites(response.data.data || []);
    } catch (error) {
      console.error("Error fetching favorite data:", error);
    }
  };

  // 🎵 Navigate and save language/object IDs
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

  const handelBack = () => {
    navigation.navigate("Search");
  };

  // ⚡ Fetch favorites every 5 seconds
  useEffect(() => {
    GetHandeldata();
    const interval = setInterval(GetHandeldata, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🎧 Fetch all playlist data
  const GetHandeldatas = async () => {
    try {
      const response = await axios.get(
        "http://192.168.18.224:5000/api/auth/get-all-playlistdata",
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Fetched Playlist Data:", response.data);
      setRecentlyPlayed(response.data.data || []);
    } catch (error) {
      console.error("Error fetching playlist data:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      GetHandeldatas();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* 🔙 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handelBack}>
          <Ionicons name="arrow-back" size={26} color="#AAA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My All Time Favourite Songs</Text>
        <Ionicons name="settings-outline" size={26} color="#AAA" />
      </View>

      {/* 👤 Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOooOkfROMa0o63sICp2yJqWIGuvWXHoi0gw&s",
          }}
          style={styles.profileImage}
        />
        <View style={{ marginTop: 10, alignItems: "center" }}>
          <Text style={styles.name}>Sarwar Jahan</Text>
          <Text style={styles.email}>sarwarmusic@gmail.com</Text>
          <Text style={styles.member}>Gold Member</Text>
          <Text style={styles.bio}>Love Music and I am not a Musician.</Text>
        </View>
      </View>

      {/* 💿 Favourite Albums */}
      <Text style={styles.sectionTitle}>Favourite Album</Text>
      <View style={styles.albumRow}>
        <FlatList
          data={recentlyPlayed}
          keyExtractor={(item) => item._id}
          numColumns={3}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.favoriteCardGrid}
              onPress={() => handelClickdata(item.language_types_id, item._id)}
            >
              <Image
                source={{
                  uri: `http://192.168.18.183:5000/playlist/images/${item.Image}`,
                }}
                style={styles.albumImageFirst}
              />
            </TouchableOpacity>
          )}
        />
      </View>

      {/* ❤️ Favourite Songs - Scrollable Section */}
      <Text style={styles.sectionTitle}>Your Favourite Songs ❤️</Text>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {favorites.length > 0 ? (
          <View style={styles.gridContainer}>
            {favorites.map((item, index) => (
              <View key={index} style={styles.favoriteCardGrid}>
                <Ionicons
                  name="heart"
                  size={20}
                  color="red"
                  style={{ marginRight: -80, marginBottom: 5 }}
                />
                <TouchableOpacity
                  onPress={() =>
                    handelClickdata(item.language_types_id, item._id)
                  }
                >
                  <Image
                    source={{
                      uri: `http://192.168.18.183:5000/playlist/images/${item.Image}`,
                    }}
                    style={styles.albumImage}
                  />
                </TouchableOpacity>
                <Text style={styles.songTitle}>{item.title}</Text>
                <Text style={styles.artist}>{item.artist}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noDataText}>No favorite songs yet</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
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
    marginVertical: 20,
  },
  profileImage: {
    height: 120,
    width: 120,
    borderRadius: 60,
    resizeMode: "cover",
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
  member: {
    color: "#FFD700",
    fontSize: 14,
    marginVertical: 5,
  },
  bio: {
    color: "#AAA",
    textAlign: "center",
    width: "80%",
  },
  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
  albumRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  favoriteCardGrid: {
    width: "30%",
    backgroundColor: "#1C1632",
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  albumImageFirst: {
    height: 130,
    width: 130,
    borderRadius: 10,
  },
  albumImage: {
    height: 90,
    width: 90,
    borderRadius: 10,
  },
  songTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  artist: {
    color: "#AAA",
    fontSize: 13,
    textAlign: "center",
  },
  noDataText: {
    color: "#888",
    textAlign: "center",
    marginVertical: 10,
  },
});

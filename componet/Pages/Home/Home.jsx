import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://192.168.18.224:5000");

export default function HomeScreen() {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);

  const navigation = useNavigation();

  // ---------------------- SEARCH THE SONG -----------------------
  const handleSearch = async (text) => {
    setSearchText(text);

    if (text.length < 1) {
      setResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://192.168.18.224:5000/api/auth/search-playlists?query=${text}`
      );

      setResults(response.data.data);
    } catch (error) {
      console.log("Search Error:", error);
    }
  };

  const handleSelectSong = (index, list) => {
    navigation.navigate("Search", {
      songIndex: index,
      songsList: list,
    });
  };

  const handelClickdata = async (languageId, objectId) => {
    try {
      await AsyncStorage.removeItem("language_types_id");
      await AsyncStorage.removeItem("objectId");

      await AsyncStorage.setItem("language_types_id", String(languageId));
      await AsyncStorage.setItem("objectId", String(objectId));

      navigation.navigate("Search");
    } catch (error) {
      console.error("Storage Error:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      GetHandeldata();
      GetHandelalldata();

      socket.on("newPlaylist", (newData) => {
        setRecommended((prev) => [newData, ...prev]);
      });

      return () => {
        socket.off("newPlaylist");
      };
    }, [])
  );

  // Fetch Recently Played
  const GetHandeldata = async () => {
    try {
      const response = await axios.get(
        "http://192.168.18.224:5000/api/auth/get-all-playlistdata"
      );
      setRecentlyPlayed(response.data.data);
    } catch (error) {
      console.error("Error fetching playlist data:", error);
    }
  };

  // Fetch Recommended
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
        <View style={styles.profile}>
          <Image
            source={{
              uri: "https://a10.gaanacdn.com/gn_img/artists/Dk9KNk23Bx/k9KNqJJbBx/size_m_1739172212.webp",
            }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.profileName}>Sarwar Jahan</Text>
            <Text style={styles.memberType}>Gold Member</Text>
          </View>
        </View>
        <Icon name="notifications-outline" size={26} color="#fff" />
      </View>

      <Text style={styles.title}>Listen The Latest Musics</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#aaa" />
        <TextInput
          style={styles.input}
          placeholder="Search songs, artists..."
          placeholderTextColor="#ffffff80"
          value={searchText}
          onChangeText={handleSearch}
          returnKeyType="search"
          onSubmitEditing={() =>
            navigation.navigate("Search", { query: searchText })
          }
        />
      </View>

      {/* Search Results */}
      <ScrollView>
        {results.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.row}
            onPress={() => handleSelectSong(index, results)}
          >
            <Image
              source={{
                uri: `http://192.168.18.224:5000/playlist/images/${item.Image}`,
              }}
              style={styles.image}
            />
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.artist}>{item.artist}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Recently Played */}
      <Text style={styles.sectionTitle}>Recently Played</Text>
      <FlatList
        horizontal
        data={recommended}
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recentItem}
            onPress={() => handelClickdata(item.language_types_id, item._id)}
          >
            <Image
              source={{
                uri: `http://192.168.18.224:5000/playlist/images/${item.Image}`,
              }}
              style={styles.recentImage}
            />
            <Text style={styles.recentTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Recommended */}
      <Text style={styles.sectionTitle}>Recommend for you</Text>
      <FlatList
        data={recentlyPlayed}
        keyExtractor={(item) => item._id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recommendRow}
            onPress={() => handelClickdata(item.language_types_id, item._id)}
          >
            <Image
              source={{
                uri: `http://192.168.18.224:5000/playlist/images/${item.Image}`,
              }}
              style={styles.recommendImage}
            />
            <View>
              <Text style={styles.recommendTitle}>{item.title}</Text>
              <Text style={styles.recommendArtist}>{item.artist}</Text>
              <Text style={styles.recommendArtist}>{item.language_types}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0820",
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  input: {
    flex: 1,
    color: "white",
    marginLeft: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profile: { flexDirection: "row", alignItems: "center" },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  profileName: { color: "#fff", fontSize: 16, fontWeight: "600" },
  memberType: { color: "#d4af37", fontSize: 12 },
  title: { color: "#fff", fontSize: 20, fontWeight: "700", marginTop: 20 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1b1730",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginVertical: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
  row: { flexDirection: "row", marginVertical: 10 },
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  artist: { color: "#aaa", fontSize: 11 },
  recentItem: { marginRight: 15, alignItems: "center" },
  recentImage: { width: 120, height: 120, borderRadius: 10 },
  recentTitle: { color: "#fff", fontSize: 13, marginTop: 5 },
  recommendRow: { flexDirection: "row", marginVertical: 10 },
  recommendImage: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  recommendTitle: { color: "#fff", fontSize: 14, fontWeight: "600" },
  recommendArtist: { color: "#aaa", fontSize: 12 },
});



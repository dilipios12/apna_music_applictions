import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import Sound from "react-native-sound";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

Sound.setCategory("Playback");

const SearchScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [songsList, setSongsList] = useState([]);

  const navigation = useNavigation();
  const route = useRoute();
  const [isFavorite, setIsFavorite] = useState(false);

  const { query, songIndex, songsList: searchList } = route.params || {};

  // Shuffle & Repeat state
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  const currentSong = songsList[currentIndex];

  // ------------------------------
  // GO BACK HOME
  // ------------------------------
  const handelClick = () => {
    navigation.navigate("Home");
  };

  // ------------------------------
  // LOAD PLAYLIST IF NOT FROM SEARCH
  // ------------------------------
  useFocusEffect(
    React.useCallback(() => {
      if (!searchList) {
        GetHandeldata();
      }
    }, [searchList])
  );

  // ------------------------------
  // FETCH ALL SONGS
  // ------------------------------
  const GetHandeldata = async () => {
    try {
      const languageId = await AsyncStorage.getItem("language_types_id");
      const objectIdsss = await AsyncStorage.getItem("objectId");

      if (!languageId) return;

      const response = await axios.post(
        "http://192.168.18.224:5000/api/auth/getAllData",
        { language_types_id: languageId, objectId: objectIdsss },
        { headers: { "Content-Type": "application/json" } }
      );

      setSongsList(response.data.data);
    } catch (error) {
      console.error("Error fetching playlist data:", error);
    }
  };

  // ------------------------------
  //  SONG LOADER
  // ------------------------------
  useEffect(() => {
    if (songsList.length > 0) loadSong();

    return () => {
      if (sound) sound.release();
    };
  }, [currentIndex, songsList]);

  const loadSong = () => {
    if (sound) sound.release();
    if (!currentSong) return;

    const encodedFileName = encodeURIComponent(currentSong.songurl);
    const songUrl = `http://192.168.18.183:5000/upload/${encodedFileName}`;

    const newSound = new Sound(songUrl, null, (error) => {
      if (error) return;

      setSound(newSound);
      setDuration(newSound.getDuration());
    });
  };

  // ------------------------------
  //  PROGRESS TRACKING
  // ------------------------------
  useEffect(() => {
    let interval;
    if (isPlaying && sound) {
      interval = setInterval(() => {
        sound.getCurrentTime((seconds) => setPosition(seconds));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, sound]);

  // ------------------------------
  // PLAY / PAUSE
  // ------------------------------
  const handlePlayPause = () => {
    if (!sound) return;

    if (isPlaying) {
      sound.pause();
      setIsPlaying(false);
    } else {
      sound.stop(() => {
        sound.play((success) => {
          if (success) handleNext();
          setIsPlaying(false);
        });
        setIsPlaying(true);
      });
    }
  };

  // ------------------------------
  // NEXT SONG
  // ------------------------------
  const handleNext = () => {
    if (currentIndex < songsList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
    setIsPlaying(false);
    setPosition(0);
  };

  // ------------------------------
  // PREVIOUS SONG
  // ------------------------------
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(songsList.length - 1);
    }
    setIsPlaying(false);
    setPosition(0);
  };

  // ------------------------------
  // FORMAT TIME
  // ------------------------------
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progressPercent = duration ? (position / duration) * 100 : 0;

  // ------------------------------
  // HANDLE SONG SELECT FROM SEARCH
  // ------------------------------
  const handleSelectSong = (index, list) => {
    setSongsList(list);
    setCurrentIndex(index);
    setResults([]); // hide results
  };

  // ------------------------------
  // SEARCH API
  // ------------------------------
  // FIRST TIME LOAD FROM SEARCH NAVIGATION
  // ------------------------------
  useEffect(() => {
    if (searchList) {
      setSongsList(searchList);
      setCurrentIndex(songIndex);
    }
  }, [searchList]);

  if (!currentSong) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Loading...</Text>
      </View>
    );
  }

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <LinearGradient colors={["#0B0820", "#1a1040"]} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handelClick}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{currentSong.title}</Text>

          <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={26}
              color={isFavorite ? "red" : "#fff"}
            />
          </TouchableOpacity>
        </View>

        {/* SEARCH RESULTS LIST */}
        {results.length > 0 && (
          <View>
            {results.map((item, index) => (
              <TouchableOpacity
                key={item._id || index}
                style={styles.row}
                onPress={() => handleSelectSong(index, results)}
              >
                <Image
                  source={{
                    uri: `http://192.168.18.183:5000/playlist/images/${item.Image}`,
                  }}
                  style={styles.image}
                />
                <View>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.artist}>{item.artist}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* NOW PLAYING ALBUM */}
        <View style={styles.albumContainer}>
          <Image
            source={{
              uri: `http://192.168.18.183:5000/playlist/images/${currentSong.Image}`,
            }}
            style={styles.albumImage}
          />
        </View>

        {/* SONG INFO */}
        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{currentSong.title}</Text>
          <Text style={styles.artistName}>{currentSong.artist}</Text>
        </View>

        {/* PROGRESS BAR */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
            />
          </View>

          <View style={styles.progressTimeRow}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* CONTROLS */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => setIsShuffling(!isShuffling)}>
            <Ionicons name="shuffle-outline" size={26} color="#AAA" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePrev}>
            <Ionicons name="play-skip-back" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={30}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext}>
            <Ionicons name="play-skip-forward" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsRepeating(!isRepeating)}>
            <Ionicons name="repeat-outline" size={26} color="#AAA" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 20,
  },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "600" },

  row: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#1b1730",
    marginVertical: 6,
    borderRadius: 8,
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  title: { color: "white", fontSize: 16, fontWeight: "600" },
  artist: { color: "#AAA", fontSize: 12 },

  albumContainer: { marginTop: 40, alignItems: "center" },
  albumImage: { width: 400, height: 340, borderRadius: 20 },

  songInfo: { alignItems: "center", marginTop: 25 },
  songTitle: { color: "white", fontSize: 22, fontWeight: "700" },
  artistName: { color: "#AAA", fontSize: 16 },

  progressContainer: { marginTop: 30, paddingHorizontal: 25 },
  progressBarBackground: { height: 3, backgroundColor: "#444", borderRadius: 3 },
  progressBarFill: { height: 3, backgroundColor: "#6C63FF", borderRadius: 3 },

  progressTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  timeText: { color: "#AAA", fontSize: 12 },

  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 10,
  },

  playButton: {
    backgroundColor: "#6C63FF",
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6C63FF",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
});

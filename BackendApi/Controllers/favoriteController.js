const Favorite = require("../Models/Favorite");

// ✅ Save or update favorite
exports.saveFavorite = async (req, res) => {
  try {
    const { title, artist, songurl, Image, language_types_id, isFavorite } = req.body;

    if (!title || !artist || !songurl || !language_types_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if already exists
    let favorite = await Favorite.findOne({ title, artist });

    if (favorite) {
      // Update favorite status (toggle)
      favorite.isFavorite = isFavorite;
      await favorite.save();
      return res.status(200).json({
        message: isFavorite ? "Added to favorites ❤️" : "Removed from favorites 💔",
        data: favorite,
      });
    }

    // If not exist, create new
    const newFavorite = new Favorite({
      title,
      artist,
      songurl,
      Image,
      language_types_id,
      isFavorite: isFavorite || 1,
    });

    await newFavorite.save();
    res.status(200).json({ message: "Song added to favorites ❤️", data: newFavorite });
  } catch (error) {
    console.error("Error saving favorite:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all favorite songs
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ isFavorite: 1 });
    res.status(200).json({
      message: "Favorites fetched successfully 🎵",
      data: favorites,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Server error" });
  }
};

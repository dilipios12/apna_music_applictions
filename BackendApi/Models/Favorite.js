const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
  title: String,
  artist: String,
  songurl: String,
  Image: String,
  language_types_id: String,
  isFavorite: {
    type: Number, // 1 = liked, 0 = unliked
    default: 1,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Favorite", FavoriteSchema);

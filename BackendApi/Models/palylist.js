
const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  songurl: { type: String, required: true },
  Image: { type: String, required: true },
  language_types_id: { type: String, required: true },
  language_types: { type: String, required: true },
});

module.exports = mongoose.model("Playlist", playlistSchema);



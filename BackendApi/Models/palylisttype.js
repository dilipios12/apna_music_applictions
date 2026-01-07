const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
    language_types_id: {
      type: Number,
      unique: true,
    },
    language_types: {
      type: String, 
      required: true,
    },
	
  });


module.exports = mongoose.model("playlist_type", playlistSchema);


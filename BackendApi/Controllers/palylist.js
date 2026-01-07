const Playlist = require("../Models/palylist");
const PlaylistType = require("../Models/palylisttype");

const {getIo} = require("../socket.js")

exports.playlists = async (req, res) => {
  try {
    const { title, artist, language_types_id } = req.body;

    const imageUrl =
      req.files && req.files["Image"] ? req.files["Image"][0].filename : null;
    const songFile =
      req.files && req.files["songurl"] ? req.files["songurl"][0].filename : null;

    if (!title || !artist || !songFile || !imageUrl || !language_types_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const languageType = await PlaylistType.findOne({ language_types_id });
    if (!languageType) {
      return res.status(404).json({ message: "Invalid language_types_id" });
    }

    const newPlaylist = new Playlist({
      title,
      artist,
      songurl: songFile,
      language_types_id,
      language_types: languageType.language_types,
      Image: imageUrl,
    });

    await newPlaylist.save();

    // ✅ Emit socket event safely
    const io = getIo();
    io.emit("newPlaylist", newPlaylist);

    res.status(201).json({
      message: "Playlist uploaded successfully",
      data: newPlaylist,
    });
  } catch (err) {
    console.error("❌ Playlist Upload Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};



exports.playlistType = async (req, res) => {
  try {
    const { language_types_id, language_types } = req.body;

    // ✅ Prevent duplicate language type IDs
    const existing = await PlaylistType.findOne({ language_types_id });
    if (existing) {
      return res.status(400).json({ message: "Language type ID already exists" });
    }

    const addType = new PlaylistType({
      language_types_id,
      language_types,
    });

    await addType.save();

    res.status(201).json({
      message: "Playlist type added successfully",
      data: addType,
    });
  } catch (err) {
    console.error("❌ PlaylistType Upload Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


exports.handelGetdata = async (req, res) => {
  try {
    const { language_types_id, objectId } = req.body;

    console.log("🔍 language_types_id:", language_types_id);
    console.log("🔍 objectId:", objectId);

    if (!language_types_id) {
      return res.status(400).json({ message: "language_types_id is required" });
    }

    // ✅ Fetch all playlists of the same language type
    const allPlaylists = await Playlist.find({ language_types_id });

    let finalData = allPlaylists;

    // ✅ If objectId provided, move that item to top
    if (objectId) {
      const mainPlaylist = allPlaylists.find(
        (item) => item._id.toString() === objectId
      );

      if (mainPlaylist) {
        // Remove it from the list and place it on top
        finalData = [
          mainPlaylist,
          ...allPlaylists.filter((item) => item._id.toString() !== objectId),
        ];
      }
    }

    res.status(200).json({
      message: "Playlist data fetched successfully",
      count: finalData.length,
      data: finalData,
    });
  } catch (error) {
    console.error("❌ Server error:", error.message);
    res.status(500).json({ error: "Data not found" });
  }
};




exports.handelGetAllData = async(req,res)=>{
  try{
 
    const data= await  Playlist.find();
       res.status(200).json({
        Massges:"Playlist data fetched successfully",
        data
       });
  }catch{
    console.log("server erros");
    res.status(500).json({error:"data note found"})
  }
}

exports.handelGetOneby = async (req, res) => {
  try {
    const data = await Playlist.aggregate([
      {
        $group: {
          _id: "$language_types", // Group by language name
          onePlaylist: { $first: "$$ROOT" } // Pick the first record per group
        }
      },
      {
        $replaceRoot: { newRoot: "$onePlaylist" }
      }
    ]);

    res.status(200).json({
      message: "Fetched one playlist per language",
      data,
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




exports.searchPlaylists = async (req, res) => {
  try {
    const { query } = req.query; // ?query=songname
    console.log(req.query);

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const result = await Playlist.find({
      $or: [
        { title: { $regex: query, $options: "i" } },          // title search
        { artist: { $regex: query, $options: "i" } },         // artist search
        { language_types: { $regex: query, $options: "i" } }  // language_types search
      ]
    });

    res.status(200).json({
      message: "Search results",
      data: result,
    });
  } catch (err) {
    console.error("Search Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

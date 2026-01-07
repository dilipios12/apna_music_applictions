const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./Config/database_connect');
const cors = require('cors');
const http = require("http");
const { initSocket } = require("./socket");
const authRoutes = require('./Router/authRoutes');

dotenv.config();
const app = express();
app.use(cors());
connectDB();
app.use(express.json());

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Initialize socket BEFORE routes are loaded
const io = initSocket(server);

// ✅ Now load routes (these may emit socket events)
app.use('/api/auth', authRoutes);
app.use("/playlist/images", express.static("./public/upload"));
app.use(
  "/upload",
  (req, res, next) => {
    res.setHeader("Content-Type", "audio/mpeg");
    next();
  },
  express.static("public/upload")
);

// ✅ Start the same server socket uses
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running with Socket.IO on port ${PORT}`);
});

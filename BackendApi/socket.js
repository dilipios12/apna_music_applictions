let ioInstance;

function initSocket(server) {
  const socketIo = require("socket.io");
  ioInstance = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  ioInstance.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });

  return ioInstance;
}

function getIo() {
  if (!ioInstance) {
    throw new Error("Socket.io not initialized yet!");
  }
  return ioInstance;
}

module.exports = { initSocket, getIo };

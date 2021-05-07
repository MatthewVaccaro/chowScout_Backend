const express = require("express");
const cors = require("cors");
// Routes
const washRoute = require("./routes/washRoute");
const earlyEmail = require("./routes/earlyEmail");
const searchRoute = require("./routes/searchRoute");
const utilityRouter = require("./routes/utilityRouter");

const server = express();

server.use(express.json());
server.use(cors());

// ANCHOR Interal
server.use("/api/internal/washer", washRoute);
server.use("/early_email", earlyEmail);
server.use("/api/internal/utility", utilityRouter);

// ANCHOR Client
server.use("/api/client", searchRoute);

server.get("/", (req, res) => {
	res.status(200).json({ message: "Testing End Point" });
});

module.exports = server;

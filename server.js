const express = require("express");
const cors = require("cors");
// Routes
const washRoute = require("./routes/washRoute");
const earlyEmail = require("./routes/earlyEmail");
const searchRoute = require("./routes/searchRoute");
const statesRouter = require("./routes/statesRouter");

const server = express();

server.use(express.json());
server.use(cors());

// Always starts with API
// Interal or external
// Resource / action

server.use("/api/internal/washer", washRoute);
// server.use("/api/wash", washRoute);
server.use("/early_email", earlyEmail);
// TODO: Early email ^ will be depracated after launch
server.use("/api/search", searchRoute);
// TODO: Rough architecture, need to come back at somepoint and think this through beter
server.use("/api/utility", statesRouter);

// Interal Routes: Anything the client facing app wont need
// ChowScout Search Routes: Anything directly related to the needs of the client
// Utility/Resoucres: Resource simplified endpoints that can be used interally or client facing

server.get("/", (req, res) => {
	res.status(200).json({ message: "Testing End Point" });
});

module.exports = server;

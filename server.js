const express = require('express');
const cors = require('cors');
// Routes
const washRoute = require('./routes/washRoute');
const earlyEmail = require('./routes/earlyEmail');
const searchRoute = require('./routes/searchRoute');
const statesRouter = require("./routes/statesRouter")

const server = express();

server.use(express.json());
server.use(cors());
server.use('/api/wash', washRoute);
server.use('/early_email', earlyEmail);
// TODO: Early email ^ will be depracated after launch
server.use('/api/search', searchRoute)
// TODO: Rough architecture, need to come back at somepoint and think this through beter
server.use('/api/utility', statesRouter)


server.get('/', (req, res) => {
	res.status(200).json({ message: 'Testing End Point' });
});

module.exports = server;
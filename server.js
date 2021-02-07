const express = require('express');
const cors = require('cors');
// Routes
const firstRoute = require('./routes/firstRoute');

const server = express();

server.use(express.json());
server.use(cors());
server.use('/api/firstRoute', firstRoute);

server.get('/', (req, res) => {
	res.status(200).json({ message: 'Testing End Point' });
});

module.exports = server;
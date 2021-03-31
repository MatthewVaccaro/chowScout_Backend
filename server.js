const express = require('express');
const cors = require('cors');
// Routes
const washRoute = require('./routes/washRoute');
const earlyEmail = require('./routes/earlyEmail');

const server = express();

server.use(express.json());
server.use(cors());
server.use('/api/wash', washRoute);
server.use('/early_email', earlyEmail);


server.get('/', (req, res) => {
	res.status(200).json({ message: 'Testing End Point' });
});

module.exports = server;
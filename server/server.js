const express = require('express');
const path = require('path');
const busboy = require('connect-busboy');

const Middleware = require('./middleware/middleware.js');
const IPFSNft = require('./ipfsNft/ipfsNft.js');
const Config = require('./config/config.js');

var app = express();
app.listen(Config.port, () => console.log(`Gateway listening on port ${Config.port}!`));

// CORS
Middleware.corsMiddleware(app);

// IPFS NFT
app.use('/', busboy());
app.use(express.static(path.join(__dirname, 'public')));
app.post('/', function(req,res) {IPFSNft.ipfsNFT(req,res)});

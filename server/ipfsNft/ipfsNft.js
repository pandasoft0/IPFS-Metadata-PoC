const path = require('path');
const fs = require('fs-extra');

const Minter = require('./minter.js');
const Config = require('../config/config.js');

// Execute IPFS commands from shell
function execShellCommand(cmd) {
 const exec = require('child_process').exec;
 return new Promise((resolve, reject) => {
  exec(cmd, (error, stdout, stderr) => {
   if (error) {
    console.log(error);
   }
   resolve(stdout? stdout : stderr);
  });
 });
}

async function ipfsNFT(req,res) {
  var fstream;
  req.pipe(req.busboy);

  // Get name & attributes
  var itemName;
  var itemAttributes = '[';
  var itemDescription;
  req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
    if(key == 'itemName') {
      itemName = value;
    } else if (key == 'attributes') {
      for (var i = 0; i < JSON.parse(value).length; i++) {
        itemAttributes += JSON.parse(value)[i];
        if (i == (JSON.parse(value).length - 1)) {
          itemAttributes += ']'
        } else {
          itemAttributes += ','
        }
      }
    } else if (key == 'itemDescription') {
      itemDescription = value;
    }
  });


  req.busboy.on('file', async function (fieldname, file, filename) {

    // Create Filename
    // Optional gather other information
    let filename_tmp = await filename.toString();
    let name_tmp = await filename_tmp.split('.');
    var Name = name_tmp[0];
    var Ext = name_tmp[1];
    var Filename = filename_tmp.replace(/\s+/g, '-');


console.log('Minting Token')
    ////////////////////////////////////////////////////////////////////
    // Mint Token
    // We can skip this part to only upload new asset metadata to IPFS
    /////////////////////////////////////////////////////////////////////
    const TxReturn = await Minter.mint();
    var token_id = TxReturn.token_id;
    var txHash = TxReturn.txHash;
console.log('Done')

      // Save image to local storage
      var fstream = await fs.createWriteStream(Config.ipfs_local_storage + Filename);
      file.pipe(fstream);

      // File wrote to storage
      fstream.on('close', async function () {

console.log('Pinning image to IPFS')
	// Pin image to IPFS
        let fileLocation = '/ipfs-storage/' + Filename;
        let cmd = 'ipfs add '+fileLocation;
        let ipfs = await execShellCommand(cmd);
        var ipfs_image_hash = ipfs.split(' ')[1];
console.log('Done');

	// Create Metadata
        var metadata = {
          "attributes": JSON.parse(itemAttributes),
          "description": itemDescription,
          "external_url": Config.ipfs_gateway + ipfs_image_hash,
          "image": Config.ipfs_gateway + ipfs_image_hash,
          "name": itemName
        }
        let metaString = await JSON.stringify(metadata);

	// Save metadata to storage
        //let metaStream = await fs.writeFileSync(Config.ipfs_local_storage + token_id + '.json', JSON.stringify(metadata));
        let metaStream = await fs.writeFileSync(Config.ipfs_local_storage + token_id, metaString);

console.log('Pinning metadata to IPFS')
	// Pin metadata to IPFS
        //let MetaLocation = Config.ipfs_local_storage + token_id + '.json';
        let MetaLocation = Config.ipfs_local_storage + token_id;
        let addMeta = 'ipfs add '+MetaLocation;
        let ipfs_meta = await execShellCommand(addMeta);
        var ipfs_meta_hash = ipfs_meta.split(' ')[1];

console.log('Done');

console.log('Updating IPFS directory')
	// Pin directory to IPFS / Get new directory CID
        let addDir = 'ipfs add -r ' + Config.ipfs_local_storage;
        let ipfs_dir_added = await execShellCommand(addDir);
        let dir_hashes = JSON.stringify(ipfs_dir_added);
        var ipfs_parentDir = dir_hashes.split(' ')[dir_hashes.split(' ').length - 2]
console.log('Done');

console.log('Publishing new directory CID to IPNS')
	// Publish the new directory hash to IPNS as our PeerID
        let publish = 'ipfs name publish ' + ipfs_parentDir;
        // We dont have to await this unless we want to be sure its up-to-date on all gateways
        let PublishedDir = await execShellCommand(publish);
console.log('Done')

	// Send back some links to check everything
        let link = Config.ipfs_gateway + ipfs_image_hash;
        let OS_Meta = Config.ipfs_gateway + ipfs_meta_hash;
        let txUrl = 'https://rinkeby.etherscan.io/tx/' + txHash;
        let openSea = 'https://rinkeby.opensea.io/assets/' + Config.nft_contract_address + '/' + token_id;

        res.send({'file':link, 'openSea': openSea, 'tx': txUrl, 'meta': OS_Meta});
        return res.end();
      });
    });
}

module.exports = {
  ipfsNFT : ipfsNFT
}

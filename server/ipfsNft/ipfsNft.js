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

    let filename_tmp = await filename.toString();
    let name_tmp = await filename_tmp.split('.');

    var Name = name_tmp[0];
    var Ext = name_tmp[1];
    var Filename = filename_tmp.replace(/\s+/g, '-');
console.log(itemAttributes)
return

console.log('Minting Token')
////////////////////////////////////////////////////////////////////
// We can skip this part to only upload new asset metadata to IPFS
// However, this does provide a fast way to test the meta on rinkeby
/////////////////////////////////////////////////////////////////////

//    const TxReturn = await Minter.mint();
//    var token_id = TxReturn.token_id;
//    var txHash = TxReturn.txHash;
var token_id = 432;
var txHash = '0xfdsfsdfsfds';
console.log('Done')

      var fstream = await fs.createWriteStream(Config.ipfs_local_storage + Filename);
      file.pipe(fstream);

      fstream.on('close', async function () {

console.log('Uploading user file to IPFS')

        let fileLocation = '/ipfs-storage/' + Filename;
        let cmd = 'ipfs add '+fileLocation;
        let ipfs = await execShellCommand(cmd);
        var ipfs_file_hash = ipfs.split(' ')[1];
console.log('Done');

        var metadata = {
          "attributes": itemAttributes,
          "description": itemDescription,
// Website that shows the assets with details
          "external_url": Config.ipfs_gateway + ipfs_file_hash,
          "image": Config.ipfs_gateway + ipfs_file_hash,
          "name": itemName
        }
        let metaString = await JSON.stringify(metadata);

// .json or nah
        //let metaStream = await fs.writeFileSync(Config.ipfs_local_storage + token_id + '.json', JSON.stringify(metadata));
        let metaStream = await fs.writeFileSync(Config.ipfs_local_storage + token_id, metaString);

console.log('Pushing metadata to IPFS')
// .json or nah
        //let MetaLocation = Config.ipfs_local_storage + token_id + '.json';
        let MetaLocation = Config.ipfs_local_storage + token_id;

        let addMeta = 'ipfs add '+MetaLocation;
        let ipfs_meta = await execShellCommand(addMeta);
        var ipfs_meta_hash = ipfs_meta.split(' ')[1];

console.log('Done');

console.log('Updating IPFS directory')
        let addDir = 'ipfs add -r' + Config.ipfs_local_storage;
        let ipfs_dir_added = await execShellCommand(addDir);
        let dir_hashes = JSON.stringify(ipfs_dir_added);
        var ipfs_parentDir = dir_hashes.split(' ')[dir_hashes.split(' ').length - 2]
console.log('Done');

console.log('Publishing new directory CID to IPNS')
        let publish = 'ipfs name publish ' + ipfs_parentDir;

        // We dont have to await this unless we want to be sure its up-to-date on all gateways
        let PublishedDir = await execShellCommand(publish);
console.log('Done')

        let link = Config.ipfs_gateway + ipfs_file_hash;
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

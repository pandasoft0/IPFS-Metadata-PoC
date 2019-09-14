require('dotenv').config({path: process.cwd() + '/.env'});

const PORT = process.env.PORT;
const MNEMONIC = process.env.MNEMONIC;
const INFURA_KEY = process.env.INFURA_KEY;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;
const IPFS_GATEWAY = process.env.IPFS_GATEWAY;
const IPFS_LOCAL_STORAGE = process.env.IPFS_LOCAL_STORAGE;

module.exports = {
  port                 : PORT,
  mnemonic             : MNEMONIC,
  infura_key           : INFURA_KEY,
  nft_contract_address : NFT_CONTRACT_ADDRESS,
  owner_address        : OWNER_ADDRESS,
  network              : NETWORK,
  ipfs_gateway         : IPFS_GATEWAY,
  ipfs_local_storage   : IPFS_LOCAL_STORAGE
}

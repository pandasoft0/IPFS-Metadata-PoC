const HDWalletProvider = require("truffle-hdwallet-provider")
const web3 = require('web3')
const Config = require('../config/config.js')

const MNEMONIC = Config.mnemonic;
const INFURA_KEY = Config.infura_key;
const NFT_CONTRACT_ADDRESS = Config.nft_contract_address;
const OWNER_ADDRESS = Config.owner_address
const NETWORK = Config.network

const NFT_ABI = [{
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      }
    ],
    "name": "mintTo",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}];

async function mint() {
    const provider = new HDWalletProvider(MNEMONIC, `https://${NETWORK}.infura.io/v3/${INFURA_KEY}`)
    const web3Instance = new web3(
        provider
    )

    const nftContract = new web3Instance.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS, { gasLimit: "1000000" })

    const Tx = await nftContract.methods.mintTo(OWNER_ADDRESS).send({ from: OWNER_ADDRESS });
    let tokenID = await web3.utils.hexToNumber(Tx.events[0].raw.topics[Tx.events[0].raw.topics.length - 1])
    let txHash = Tx.transactionHash;
    let txReturn = {'token_id': tokenID, 'txHash': txHash}
    return txReturn;
}

module.exports = {
    mint : mint
}

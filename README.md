# IPFS Metadata PoC

### Requirements
1. [IPFS Node](https://docs.ipfs.io/guides/guides/install/)
    - Pre-Built
    - Source
2. Node.js (11+) 

##
### /client
##### Configure
> index.html  
> line: 81  
> var local_server = "http://127.0.0.1:5000";  

Set the local_server variable to the location of your server for this repo.

##

### /server
##### Configure
Copy tmp-env to .env: `cp tmp-env .env`  
Configure .env  
```
PORT='(INT)'
MNEMONIC='(FOR CONTRACT OWNER ACCOUNT {USE DEV WALLETS})'
INFURA_KEY='(INFURA API CODE)'
NFT_CONTRACT_ADDRESS='(CONTRACT ADDRESS)'
OWNER_ADDRESS='(OWNER ACCOUNT PUBLIC ADDRESS)'
NETWORK='(NETWORK {RINKEBY})'
IPFS_GATEWAY='(IPFS GATEWAY {https://ipfs.io/ipfs/ || https://ipfs.io/ipns/<ipns CID>/ || /ipfs/ || /ipns/<IPNS CID>})'
IPFS_LOCAL_STORAGE='(LOCAL IPFS STORAGE LOCATION)'
```
* Current IPFS_GATEWAY must include a gateway domain  
  In the future there should be more support for just plain '/ipfs/' & '/ipns/'  
  For now ONLY USE "https://ipfs.io/ipfs/" or local public gateway (ex: https://ipfs.cr0wngh0ul.org/ipns/)

##### Start
    node server
##

### /contract
This contract sample is taken from [OpenSea Creatures](https://github.com/ProjectOpenSea/opensea-creatures)
##### Configure
- > /contracts/CreatureFactory.sol  

    - baseURI: set to IPNS gateway with IPNS CID (ex: "https://ipfs.cr0wngh0ul.org/ipns/QmVc5VEnPedqKJsEozRBAzSm7aWcKcoPNeXwQS1p1W7y3v/")
- > /contract/Creature.sol  

    - BaseTokenURI: set to IPNS gateway with IPNS CID (ex: "https://ipfs.cr0wngh0ul.org/ipns/QmVc5VEnPedqKJsEozRBAzSm7aWcKcoPNeXwQS1p1W7y3v/") 

- When there is better support for IPFS / IPNS these should omit the gateway and only include `/ipns/<IPNS CID>`
##### Deploy Contract
```
export INFURA_KEY="<infura_key>"
export MNEMONIC="<metmask_mnemonic>"
truffle deploy --network rinkeby
```

##
### Usage

1. Open index.html in your web browser.
2. Fill out the form fields.
3. Submit the form.

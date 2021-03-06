pragma solidity ^0.5.0;

import "./TradeableERC721Token.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title Creature
 * Creature - a contract for my non-fungible creatures.
 */
contract Creature is TradeableERC721Token {
  constructor(address _proxyRegistryAddress) TradeableERC721Token("ND IPFS DEMO", "NID", _proxyRegistryAddress) public {  }

  function baseTokenURI() public view returns (string memory) {
    return "https://ipfs.cr0wngh0ul.org/ipns/QmVc5VEnPedqKJsEozRBAzSm7aWcKcoPNeXwQS1p1W7y3v/";
  }
}

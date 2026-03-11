# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

contract address 0x0217F67B40ecc96eF22389ad05E10A54957EC165

after deploy i get two events
*** OwnershipTransferred (index_topic_1 address previousOwner, index_topic_2 address newOwner)
   index address
   
   index address
   
0 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0
1: previousOwner
0x0000000000000000000000000000000000000000
2: newOwner
0x5a593640C03EA0d163034e6a060e896B62c8C15C


and 

 *** Transfer (index_topic_1 address from, index_topic_2 address to, uint256 amount)
0 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
1: from
0x0000000000000000000000000000000000000000
2: to
0x5a593640C03EA0d163034e6a060e896B62c8C15C


amount (uint256) :
42000000000000000000
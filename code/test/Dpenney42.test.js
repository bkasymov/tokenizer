const { expect } = require("chai");
const { ethers } = require("hardhat"); // ethers is a library that helps us to interact with the blockchain.
  /*
   * HOW HARDHAT TESTING WORKS
   *
   * ┌─────────────────────────────────────────────────────────┐
   * │                    YOUR COMPUTER                        │
   * │                                                         │
   * │  ┌──────────────┐       ┌────────────────────────────┐  │
   * │  │  Test file    │       │  Hardhat Local Blockchain   │  │
   * │  │  (.test.js)   │       │  (lives in RAM only)        │  │
   * │  │               │       │                             │  │
   * │  │ 1. Deploy     │──────>│  Dpenney42 contract created │  │
   * │  │    contract   │       │  at address 0x...           │  │
   * │  │               │       │                             │  │
   * │  │ 2. Call       │──────>│  balanceOf(owner) = 42      │  │
   * │  │    balanceOf  │       │                             │  │
   * │  │               │<──────│  returns result             │  │
   * │  │ 3. Check      │       │                             │  │
   * │  │    expect()   │       │                             │  │
   * │  │    42 == 42?  │       │                             │  │
   * │  │    PASS!      │       │                             │  │
   * │  └──────────────┘       └────────────────────────────┘  │
   * │                                                         │
   * │         Test done — blockchain destroyed                │
   * │         Nothing sent to the internet                    │
   * └─────────────────────────────────────────────────────────┘
   */

describe("Dpenney42", function() {
    it("Should mint initial supply to owner", async function() {
        const [owner] = await ethers.getSigners(); // get the first signer which is the owner.
        const token = await ethers.deployContract("Dpenney42", [42]); // deploy the contract and pass the initial supply.

        const ownerBalance = await token.balanceOf(owner.address);
        expect(ownerBalance).to.equal(ethers.parseEther("42"));
    })
    it("Should transfer tokens between accounts", async function() {
        const [owner, recipient] = await ethers.getSigners(); // get the first and second signer which are owner and recipient.
        const token = await ethers.deployContract("Dpenney42", [42]); // deploy the contract and pass the initial supply.
        // connect the token contract to the owner signer and call the transfer function.
        await token.connect(owner).transfer(recipient.address, ethers.parseEther("10")); // transfer 10 tokens from owner to recipient.
        // parseEther is a function that converts the string "10" to the number 10.
        expect(await token.balanceOf(recipient.address)).to.equal(ethers.parseEther("10"));
        expect(await token.balanceOf(owner.address)).to.equal(ethers.parseEther("32"));
    })
    it("Should approve and transferFrom tokens between accounts", async function() {
        const [owner, recipient, spender] = await ethers.getSigners(); // get the first, second and third signer which are owner, recipient and spender.
        const token = await ethers.deployContract("Dpenney42", [42]); // deploy the contract and pass the initial supply.

        await token.connect(owner).approve(spender.address, ethers.parseEther("7"));
        await token.connect(spender).transferFrom(owner.address, recipient.address, ethers.parseEther("7"));

        expect(await token.balanceOf(recipient.address)).to.equal(ethers.parseEther("7"));
        expect(await token.allowance(owner.address, spender.address)).to.equal(0); // check if the allowance is 0.
    })

    it("Should allow only owner to mint tokens", async function() {
        const [owner, another_user] = await ethers.getSigners(); // get the first and second signer which are owner and another user.
        const token = await ethers.deployContract("Dpenney42", [42]); // deploy the contract and pass the initial supply.

        await token.connect(owner).mint(owner.address, ethers.parseEther("5"));
        expect(await token.balanceOf(owner.address)).to.equal(ethers.parseEther("47"));
        try {
            await token.connect(another_user).mint(another_user.address, ethers.parseEther("5"));
            expect(false).to.be.true; // if the mint function is called, the test should fail.
        } catch (error) {
            expect(error.message).to.include("OwnableUnauthorizedAccount");
        }

    })
    it("Should allow users to burn their own tokens", async function() {
        const [owner, another_user] = await ethers.getSigners(); // get the first and second signer which are owner and another user.
        const token = await ethers.deployContract("Dpenney42", [42]); // deploy the contract and pass the initial supply.

        await token.connect(owner).mint(another_user.address, ethers.parseEther("10"));

        await token.connect(another_user).burn(ethers.parseEther("10"));
        expect(await token.balanceOf(another_user.address)).to.equal(ethers.parseEther("0"));
    })
    
});
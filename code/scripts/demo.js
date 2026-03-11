const { ethers } = require("hardhat");

const TOKEN_ADDRESS = "0x0217F67B40ecc96eF22389ad05E10A54957EC165";
const EXPLORER = "https://testnet.bscscan.com/tx";

async function getToken() {
    return ethers.getContractAt("Dpenney42", TOKEN_ADDRESS);
}

async function showBalance(token, label, address) {
    const balance = await token.balanceOf(address);
    console.log(`  ${label}: ${ethers.formatEther(balance)} DP42`);
}

async function demoTransfer(token, to) {
    console.log("\n--- Transfer 42 DP42 ---");
    const tx = await token.transfer(to, ethers.parseEther("42"));
    await tx.wait();
    console.log(`  TX: ${EXPLORER}/${tx.hash}`);
}

async function demoMint(token, to) {
    console.log("\n--- Mint 42 DP42 ---");
    const tx = await token.mint(to, ethers.parseEther("42"));
    await tx.wait();
    console.log(`  TX: ${EXPLORER}/${tx.hash}`);
}

async function demoBurn(token) {
    console.log("\n--- Burn 1 DP42 ---");
    const tx = await token.burn(ethers.parseEther("1"));
    await tx.wait();
    console.log(`  TX: ${EXPLORER}/${tx.hash}`);
}

async function main() {
    const [owner] = await ethers.getSigners();
    const token = await getToken();
    const randomWallet = ethers.Wallet.createRandom();
    const randomWallet2 = ethers.Wallet.createRandom();

    console.log("=== Dpenney42 Demo ===");
    console.log(`  Owner:  ${owner.address}`);
    console.log(`  Random: ${randomWallet.address}`);

    // Initial balance
    console.log("\n--- Initial balances ---");
    await showBalance(token, "Owner", owner.address);

    // Transfer
    await demoTransfer(token, randomWallet.address);
    await showBalance(token, "Owner", owner.address);
    await showBalance(token, "Random", randomWallet.address);

    // Mint
    await demoMint(token, owner.address);
    await showBalance(token, "Owner", owner.address);

    // Burn
    await demoBurn(token);
    await showBalance(token, "Owner", owner.address);

    console.log("\n=== Demo complete ===");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

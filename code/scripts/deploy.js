const { ethers } = require("hardhat");

async function main() {
    const token = await ethers.deployContract("Dpenney42", [42]);
    await token.waitForDeployment();

    const address = await token.getAddress();
    console.log(`Dpenney42 deployed to: ${address}`);
    console.log(`Network: BSC Testnet (Chain ID: 97)`);
    console.log(`Initial supply: ${42} DP42`);
}

// This pattern is used to handle errors and exit the process with a non-zero exit code if an error occurs with the main function.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
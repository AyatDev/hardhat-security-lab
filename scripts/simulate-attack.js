const { ethers } = require("hardhat");

async function main() {
    const [deployer, attacker] = await ethers.getSigners();

    // Deploy vulnerable contract
    const VulnerableBank = await ethers.getContractFactory("VulnerableBank");
    const bank = await VulnerableBank.deploy();
    await bank.deployed();
    console.log("VulnerableBank deployed:", bank.address);

    // Deposit funds
    await bank.deposit({ value: ethers.utils.parseEther("10") });
    console.log("Deposited 10 ETH");

    // Deploy attacker
    const Attacker = await ethers.getContractFactory("Attacker");
    const attackerContract = await Attacker.connect(attacker).deploy(bank.address);
    await attackerContract.deployed();
    console.log("Attacker deployed:", attackerContract.address);

    // Execute attack
    await attackerContract.connect(attacker).attack({
        value: ethers.utils.parseEther("1")
    });

    const balance = await ethers.provider.getBalance(bank.address);
    console.log("Bank balance after attack:", ethers.utils.formatEther(balance));
}

main().catch(console.error);

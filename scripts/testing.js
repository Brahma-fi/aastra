const hre = require("hardhat");

const POOL_ADDRESS = "0x2BFD0C3169A8C0Cd7B814D38533A0645368F0D80";
const STRATEGY_MANAGER_ADDRESS = "0x0405d9d1443DFB051D5e8E231e41C911Dc8393a4";
const GOVERNANCE_ADDRESS = "0x140713bbD82113e104C3a45661134F9764807922";

async function main() {

    // deploy contracts
    const Factory = await hre.ethers.getContractFactory("Factory");
    const factory = await Factory.deploy(GOVERNANCE_ADDRESS);
    await factory.deployed();
    console.log("Factory deployed to:", factory.address);

    const Router = await hre.ethers.getContractFactory("Router");
    const router = await Router.deploy(factory.address);
    await router.deployed();
    tx = await factory.setRouter(router.address);
    await tx.wait();
    console.log("Router deployed to:", router.address);

    tx = await factory.createVault(POOL_ADDRESS, STRATEGY_MANAGER_ADDRESS, 5000, 7000, 0);
    await tx.wait();
    const vaultAddress = await factory.managerVault(STRATEGY_MANAGER_ADDRESS);
    console.log("Vault deployed to:", vaultAddress);

    // make deposit
    const Token0 = await hre.ethers.getContractAt("TestToken", '0x379c28627e0D2b219E69511Fd4CB6cFa5Db6D3f1');
    const Token1 = await hre.ethers.getContractAt("TestToken", '0x4DB30144d2037E483C442f8FA470Af00E08A6654');
    await Token0.approve(vaultAddress, 3000000000000000000n);
    await Token1.approve(vaultAddress, 3000000000000000000n);
    console.log("approveal done");
    const vault = await hre.ethers.getContractAt("Vault", vaultAddress);
    await vault.deposit("3000000000000000000", "3000000000000000000", 0, 0, STRATEGY_MANAGER_ADDRESS);
    console.log("deposit done");
    let lower_tick, upper_tick = [17900, 21200];
    await router.newLimitLiquidity(lower_tick, upper_tick, 100, true)

}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

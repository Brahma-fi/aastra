const hre = require("hardhat");
const fs = require('fs');

const etherscan_verify = true;


const POOL_ADDRESS = "0x2BFD0C3169A8C0Cd7B814D38533A0645368F0D80";
const STRATEGY_MANAGER_ADDRESS = "0x0405d9d1443DFB051D5e8E231e41C911Dc8393a4";

async function main() {

  const Factory = await hre.ethers.getContractFactory("Factory");
  const factory = await Factory.deploy();

  const accounts = await hre.ethers.getSigners();

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

  if (etherscan_verify) {
    await hre.run("verify:verify", {
        address: factory.address,
        constructorArguments: [],
    });

    await hre.run("verify:verify", {
        address: periphery.address,
        constructorArguments: [factory.address],
    });

    await hre.run("verify:verify", {
        address: vaultAddress,
        constructorArguments: [POOL_ADDRESS, 5000, 7000, 0],
    });

  }

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

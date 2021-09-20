const hre = require("hardhat");

const etherscan_verify = false;
const tenderly_fork = false;

const tenderlyConfig = {
  accountId: "bapireddy_1",
  projectId: "project",
  forkId: "50568bad-900c-402a-8d81-209f3da8c19c"
};

const POOL_ADDRESS = "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8";
const STRATEGY_MANAGER_ADDRESS = "0x140713bbD82113e104C3a45661134F9764807922";
const GOVERNANCE_ADDRESS = "0x140713bbD82113e104C3a45661134F9764807922";

async function main() {
  const signers = await hre.ethers.getSigners();
  const signerAddr = signers[0].address;
  console.log(signerAddr);

  // if (tenderly_fork) {
  //   await fetch(
  //     `https://api.tenderly.co/api/v1/account/${tenderlyConfig.accountId}/project/${tenderlyConfig.projectId}/fork/${tenderlyConfig.forkId}/balance`,
  //     {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({
  //         accounts: [signerAddr],
  //         amount: Number(hre.ethers.utils.parseEther("1").toString())
  //       })
  //     }
  //   );
  // }

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

  tx = await factory.createVault(
    POOL_ADDRESS,
    STRATEGY_MANAGER_ADDRESS,
    100000,
    0,
    0
  );
  await tx.wait();

  const vaultAddress = await factory.managerVault(STRATEGY_MANAGER_ADDRESS);

  console.log("Vault deployed to:", vaultAddress);

  if (etherscan_verify) {
    await hre.run("verify:verify", {
      address: factory.address,
      constructorArguments: [GOVERNANCE_ADDRESS]
    });

    await hre.run("verify:verify", {
      address: router.address,
      constructorArguments: [factory.address]
    });

    await hre.run("verify:verify", {
      address: vaultAddress,
      constructorArguments: [POOL_ADDRESS, 100000, 0, 0]
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

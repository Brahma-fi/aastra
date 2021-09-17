const { BigNumber } = require("@ethersproject/bignumber");
const hre = require("hardhat");
const { ethers } = require("hardhat");

const etherscan_verify = false;

const POOL_ADDRESS = "0x2BFD0C3169A8C0Cd7B814D38533A0645368F0D80";
const STRATEGY_MANAGER_ADDRESS = "0x0405d9d1443DFB051D5e8E231e41C911Dc8393a4";
const IMPERSONATING_ACCOUNT = "0xE177DdEa55d5A724515AF1D909a36543cBC4d93E";

async function main() {
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [IMPERSONATING_ACCOUNT]
  });

  const Factory = await hre.ethers.getContractFactory("Factory");
  const factory = await Factory.deploy();

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
    5000,
    7000,
    0
  );
  await tx.wait();

  const vaultAddress = await factory.managerVault(STRATEGY_MANAGER_ADDRESS);

  console.log("Vault deployed to:", vaultAddress);

  const Periphery = await hre.ethers.getContractFactory("Periphery");
  const periphery = await Periphery.deploy(vaultAddress);

  await periphery.deployed();

  console.log("Periphery deployed to:", periphery.address);

  const signer = await ethers.provider.getSigner(IMPERSONATING_ACCOUNT);

  const vault = await ethers.getContractAt("IVault", vaultAddress);
  const token0Addr = await vault.token0();
  const token1Addr = await vault.token1();

  const token0 = await ethers.getContractAt("IERC20Metadata", token0Addr);
  const token1 = await ethers.getContractAt("IERC20Metadata", token1Addr);

  for (let i = 0; i < 2; i++) {
    let token0Bal = await token0.balanceOf(signer._address);
    let token1Bal = await token1.balanceOf(signer._address);
    let vaultBal = await vault.balanceOf(signer._address);
    let transactAmt = token0Bal.div(i == 1 ? 1 : 2);

    console.log(
      "before call",
      token0Bal.toString(),
      transactAmt.toString(),
      token1Bal.toString(),
      vaultBal.toString()
    );

    await token0.connect(signer).approve(periphery.address, transactAmt);
    await periphery.connect(signer).vaultDeposit(transactAmt);

    token0Bal = await token0.balanceOf(signer._address);
    token1Bal = await token1.balanceOf(signer._address);
    vaultBal = await vault.balanceOf(signer._address);

    console.log(
      "Token balance after call",
      token0Bal.toString(),
      transactAmt.toString(),
      token1Bal.toString(),
      vaultBal.toString()
    );
  }

  if (etherscan_verify) {
    await hre.run("verify:verify", {
      address: factory.address,
      constructorArguments: []
    });

    await hre.run("verify:verify", {
      address: periphery.address,
      constructorArguments: [factory.address]
    });

    await hre.run("verify:verify", {
      address: vaultAddress,
      constructorArguments: [POOL_ADDRESS, 5000, 7000, 0]
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

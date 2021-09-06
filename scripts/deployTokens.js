const hre = require("hardhat");
const ethers = hre.ethers;

const etherscan_verify = true

const token_name_0 = "oWBTC";
const token_symbol_0 = "oWBTC";

const token_name_1 = "oWETH";
const token_symbol_1 = "oWETH";

const token_amount = 1000000000000000000000000n;
const mint_to_address = "0xAE75B29ADe678372D77A8B41225654138a7E6ff1";

async function main(){
    const Token0 = await hre.ethers.getContractFactory("TestToken");
    const token0 = await Token0.deploy(token_name_0, token_symbol_0, token_amount, mint_to_address);
    await token0.deployed();

    console.log(token_name_0, "deployed at", token0.address);

    const Token1 = await hre.ethers.getContractFactory("TestToken");
    const token1 = await Token1.deploy(token_name_1, token_symbol_1, token_amount, mint_to_address);
    await token1.deployed();

    console.log(token_name_1, "deployed at", token1.address);

    if (etherscan_verify) {
        await hre.run("verify:verify", {
            address: token0.address,
            constructorArguments: [token_name_0, token_symbol_0, token_amount, mint_to_address],
        });

        await hre.run("verify:verify", {
            address: token1.address,
            constructorArguments: [token_name_1, token_symbol_1, token_amount, mint_to_address],
        });
      }
}

async function mainNew(){

  const POOL_ADDRESS = "0x2BFD0C3169A8C0Cd7B814D38533A0645368F0D80";
  


  const Token0 = await hre.ethers.getContractAt("TestToken", '0x379c28627e0D2b219E69511Fd4CB6cFa5Db6D3f1');
  [deployer, addr1, strategy, addr3, addr4, addr5] = await ethers.getSigners();

  const STRATEGY_MANAGER_ADDRESS = deployer.address;

  console.log((await Token0.balanceOf(addr1.address)).toString());

  const Token1 = await hre.ethers.getContractAt("TestToken", '0x4DB30144d2037E483C442f8FA470Af00E08A6654');
  console.log((await Token1.balanceOf(addr1.address)).toString());

  const Factory = await hre.ethers.getContractFactory("Factory");
  const factory = await Factory.deploy();

  const accounts = await ethers.getSigners();

  await factory.deployed();

  console.log("Factory deployed to:", factory.address);

  const Periphery = await hre.ethers.getContractFactory("Periphery");
  const periphery = await Periphery.deploy(factory.address);

  await periphery.deployed();

  tx = await factory.setPeriphery(periphery.address);
  await tx.wait();

  console.log("Periphery deployed to:", periphery.address);

  tx = await factory.createVault(POOL_ADDRESS, STRATEGY_MANAGER_ADDRESS, 5000, 7000, 0);
  await tx.wait();

  const vaultAddress = await factory.managerVault(STRATEGY_MANAGER_ADDRESS);

  const vault = await hre.ethers.getContractAt("Vault", vaultAddress);

  console.log("Vault deployed to:", vaultAddress);

  await Token0.connect(addr1).approve(vaultAddress, (await Token0.balanceOf(addr1.address)));

  await Token1.connect(addr1).approve(vaultAddress, (await Token1.balanceOf(addr1.address)));

  await vault.connect(addr1).deposit(3000000000000000000n, 3000000000000000000n, 0, 0, addr1.address);

  console.log((await vault.balanceOf(addr1.address)).toString())


  tx = await(periphery.newBaseLiquidity(27000, 28500, 100, false));
  await tx.wait();

  console.log(await periphery.getBaseAmounts(vault.address));

  tx = await(periphery.newBaseLiquidity(27000, 28500, 100, true));
  await tx.wait();

  console.log(await periphery.getBaseAmounts(vault.address));

  console.log(' bal', (await Token0.balanceOf(vault.address)).toString())

  console.log(' bal', (await Token1.balanceOf(vault.address)).toString())


  

}

mainNew()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
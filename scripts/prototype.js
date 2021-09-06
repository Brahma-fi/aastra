const hre = require("hardhat");
const fs = require('fs');

const etherscan_verify = false;


const POOL_ADDRESS = "0x6D2FF6BAFB5777fED4BB73D4892Ad00085A9E532"; //KOVAN

// const POOL_ADDRESS = "0xCBCdF9626bC03E24f779434178A73a0B4bad62eD"; //MAINNET -WBTC/WETH


async function main() {

  const Factory = await hre.ethers.getContractFactory("Factory");
  const factory = await Factory.deploy();

  const address = await hre.ethers.getSigners();

  const STRATEGY_MANAGER_ADDRESS = address[0].address;

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

  console.log("Vault deployed to:", vaultAddress);



  const token0 = "0xd3A691C852CDB01E281545A27064741F0B7f6825"; // KOVAN
  const token1 = "0xd0A1E359811322d97991E03f863a0C30C2cF029C"; // KOVAN

//   const token0 = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"; // MAINNET
//   const token1 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // MAINNET


  const ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

  WBTC = await ethers.getContractAt("IERC20", token0);
  WETH = await ethers.getContractAt("IWETH9", token1);
  routerInstance = await ethers.getContractAt("ISwapRouter", ROUTER);
    
  let overrides = {value: ethers.utils.parseEther("1")};
  tx = await WETH.deposit(overrides);
  await tx.wait();
  tx = await WETH.approve(routerInstance.address, ethers.constants.MaxUint256);
  await tx.wait();
  tx = await WBTC.approve(routerInstance.address, ethers.constants.MaxUint256);
  await tx.wait();
  console.log('ETH', await WETH.balanceOf(STRATEGY_MANAGER_ADDRESS));
  const ETHBal = await WETH.balanceOf(STRATEGY_MANAGER_ADDRESS);

  swapParams = {
      tokenIn: WETH.address,
      tokenOut: WBTC.address,
      fee: 500,
      recipient: STRATEGY_MANAGER_ADDRESS,
      deadline: 2541704532,
      amountIn: ETHBal.div(2),
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0 
  }
  tx = await routerInstance.exactInputSingle(swapParams);
  await tx.wait();

  console.log('BTC', (await WBTC.balanceOf(STRATEGY_MANAGER_ADDRESS)).toString());
  console.log('ETH', (await WETH.balanceOf(STRATEGY_MANAGER_ADDRESS)).toString());

  rebalancerInstance = await ethers.getContractAt("Vault", vaultAddress);



  const WBTCBal = await WBTC.balanceOf(STRATEGY_MANAGER_ADDRESS);
  const WETHBal = await WETH.balanceOf(STRATEGY_MANAGER_ADDRESS);

  tx = await WBTC.approve(rebalancerInstance.address, ethers.constants.MaxUint256);
  await tx.wait();
  tx = await WETH.approve(rebalancerInstance.address, ethers.constants.MaxUint256);
  await tx.wait();

  await rebalancerInstance.deposit(WETHBal, WBTCBal, 0, 0, STRATEGY_MANAGER_ADDRESS);

  console.log('LP tokens recvd', (await rebalancerInstance.balanceOf(STRATEGY_MANAGER_ADDRESS)).toString());



  const poolInstance = await ethers.getContractAt("IUniswapV3Pool", POOL_ADDRESS);
  const slotInfo = await poolInstance.slot0();
  const tickSpacing = await poolInstance.tickSpacing();

  let currentTick = slotInfo.tick;
  currentTick = parseInt((currentTick) / tickSpacing) * tickSpacing;

  let upperTick = currentTick + 100 * tickSpacing;
  let lowerTick = currentTick - 100 * tickSpacing;

  tx = await periphery.newBaseLiquidity(lowerTick, upperTick, 100);
  await tx.wait();

  console.log('current lower and upper base of vault');
  
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

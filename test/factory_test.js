const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { checkEqual, checkUnEqual, checkRevert, checkAbove, checkBelow } = require("./helper");
const { MAINNET_POOL_DAI_WETH, KOVAN_POOL_DAI_WETH, ROUTER, POOL_FEE } = require("./test_config");

//WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
// DAI = "0x6b175474e89094c44da98b954eedeac495271d0f"


let deployer, addr1, strategy, addr3, addr4, addr5;
let fee = 5000;
let maxDepositCap = 0;
let rebalancerInstance;
let poolInstance;
let factoryInstance;
let routerInstance;
let uniRouterInstance;

let DAI, WETH;

const deployFactory = async () => {

    [deployer, addr1, strategy, addr3, addr4, addr5] = await ethers.getSigners();

    const Factory = await hre.ethers.getContractFactory("Factory");
    factoryInstance = await Factory.deploy();
  
    await factoryInstance.deployed();
  
    const Router = await hre.ethers.getContractFactory("Router");
    routerInstance = await Router.deploy(factoryInstance.address);
  
    await routerInstance.deployed();
  
    tx = await factoryInstance.setRouter(routerInstance.address);
    await tx.wait;


    poolInstance = await ethers.getContractAt("IUniswapV3Pool", MAINNET_POOL_DAI_WETH);
    uniRouterInstance = await ethers.getContractAt("ISwapRouter", ROUTER);

    const token0 = await poolInstance.token0();
    const token1 = await poolInstance.token1();

    DAI = await ethers.getContractAt("IERC20", token0);
    WETH = await ethers.getContractAt("IWETH9", token1);
}

const deployRouter = async () => {
    const Router = await hre.ethers.getContractFactory("Router");
    routerInstance = await Router.deploy(factoryInstance.address);
  
    await routerInstance.deployed();
}

const deployVault = async () => {
    tx = await factoryInstance.createVault(MAINNET_POOL_DAI_WETH, strategy.address, 5000, 7000, maxDepositCap);
    await tx.wait();
  
    const vaultAddress = await factoryInstance.managerVault(strategy.address);
    rebalancerInstance = await ethers.getContractAt("Vault", vaultAddress);
}

describe("Initialize Factory", async () => {
    it("Should deploy Factory", async () => {
        await deployFactory();
        checkEqual(await factoryInstance.governance(), deployer.address);
    });
})

describe("Governance operations", async () => {
    before(async () => {
        await deployFactory();
    });

    it("Governance should be able to set Router", async () => {
        await deployRouter();
        await factoryInstance.setRouter(routerInstance.address);
        checkEqual(await factoryInstance.router(), routerInstance.address);
    });

    it("No one else should be able to set Router", async () => {
        await deployRouter();
        await checkRevert(factoryInstance.connect(addr1).setRouter(routerInstance.address), 'Only governance');
    });

    it('Can deploy vault', async () => {
        await deployRouter();
        await factoryInstance.setRouter(routerInstance.address);
        await deployVault();
        checkEqual(await rebalancerInstance.strategy(), strategy.address);
    })

    it('No one else can deploy vault', async () => {
        await deployRouter();
        await factoryInstance.setRouter(routerInstance.address);
        await checkRevert(factoryInstance.connect(addr1).createVault(MAINNET_POOL_DAI_WETH, strategy.address, 5000, 7000, maxDepositCap), 'Only governance');
    })

    it ('Can change strategy manager', async () => {
        await factoryInstance.updateManager(addr5.address, rebalancerInstance.address);
        checkEqual(await rebalancerInstance.strategy(), addr5.address);
        await factoryInstance.updateManager(strategy.address, rebalancerInstance.address);
    })

    it ('No one else change strategy manager', async () => {
        await checkRevert(factoryInstance.connect(addr1).updateManager(addr5.address, rebalancerInstance.address), 'Only governance');
    })

    it ('Can update governance', async() => {
        await factoryInstance.setGovernance(addr5.address);
        checkEqual(await factoryInstance.governance(), deployer.address);
        await factoryInstance.connect(addr5).acceptGovernance();
        checkEqual(await factoryInstance.governance(), addr5.address);

        await factoryInstance.connect(addr5).setGovernance(deployer.address);
        checkEqual(await factoryInstance.governance(), addr5.address);
        await factoryInstance.connect(deployer).acceptGovernance();
        checkEqual(await factoryInstance.governance(), deployer.address);
    })

    it ('No one else change governance', async () => {
        await checkRevert(factoryInstance.connect(addr1).setGovernance(addr5.address), 'Only governance');
    })

    it ('No random address can accept governance', async () => {
        await checkRevert(factoryInstance.connect(addr1).acceptGovernance(), 'pendingGovernance to accept governance');
    })
})
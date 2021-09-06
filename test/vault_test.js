const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { checkEqual, checkUnEqual, checkRevert, checkAbove, checkBelow } = require("./helper");
const { MAINNET_POOL_DAI_WETH, KOVAN_POOL_DAI_WETH, ROUTER, POOL_FEE } = require("./test_config");

//WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
// DAI = "0x6b175474e89094c44da98b954eedeac495271d0f"


let deployer, addr1, strategy, addr3, addr4, addr5;
let fee = 5000;
let poolFee = POOL_FEE;
let maxDepositCap = 0;
let rebalancerInstance;
let poolInstance;
let factoryInstance;
let routerInstance;
let uniRouterInstance;

let DAI, WETH;

const deploy = async () => {

    [deployer, addr1, strategy, addr3, addr4, addr5] = await ethers.getSigners();

    const Factory = await hre.ethers.getContractFactory("Factory");
    factoryInstance = await Factory.deploy();
  
    await factoryInstance.deployed();
  
    const Router = await hre.ethers.getContractFactory("Router");
    routerInstance = await Router.deploy(factoryInstance.address);
  
    await routerInstance.deployed();
  
    tx = await factoryInstance.setRouter(routerInstance.address);
    await tx.wait;

    tx = await factoryInstance.createVault(MAINNET_POOL_DAI_WETH, strategy.address, 5000, 7000, maxDepositCap);
    await tx.wait;
  
    const vaultAddress = await factoryInstance.managerVault(strategy.address);

    rebalancerInstance = await ethers.getContractAt("Vault", vaultAddress);

    poolInstance = await ethers.getContractAt("IUniswapV3Pool", MAINNET_POOL_DAI_WETH);
    uniRouterInstance = await ethers.getContractAt("ISwapRouter", ROUTER);

    const token0 = await poolInstance.token0();
    const token1 = await poolInstance.token1();

    DAI = await ethers.getContractAt("IERC20", token0);
    WETH = await ethers.getContractAt("IWETH9", token1);
}


const getPoolFunds = async(signer) => {
    let overrides = {value: ethers.utils.parseEther("100")};
    await WETH.connect(signer).deposit(overrides);
    await WETH.connect(signer).approve(uniRouterInstance.address, ethers.constants.MaxUint256)
    await DAI.connect(signer).approve(uniRouterInstance.address, ethers.constants.MaxUint256)
    const ETHBal = await WETH.balanceOf(signer.address);

    swapParams = {
        tokenIn: WETH.address,
        tokenOut: DAI.address,
        fee: 3000,
        recipient: signer.address,
        deadline: 2541704532,
        amountIn: ETHBal.div(2),
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0 
    }
    await uniRouterInstance.connect(signer).exactInputSingle(swapParams);
}

//Only call if signer has any funds
const depositToVault = async (signer) => {

    const DAIBal = DAI.balanceOf(signer.address);
    const WETHBal = WETH.balanceOf(signer.address);
    
    await DAI.connect(signer).approve(rebalancerInstance.address, ethers.constants.MaxUint256)
    await WETH.connect(signer).approve(rebalancerInstance.address, ethers.constants.MaxUint256)

    await rebalancerInstance.connect(signer).deposit(DAIBal, WETHBal, 0, 0, signer.address);

}

//Only call if signer has any shares
const withdrawFromVault = async (signer) => {
    
    await DAI.connect(signer).approve(rebalancerInstance.address, ethers.constants.MaxUint256)
    await WETH.connect(signer).approve(rebalancerInstance.address, ethers.constants.MaxUint256)

    const shares = await rebalancerInstance.balanceOf(signer.address);

    await rebalancerInstance.connect(signer).withdraw(shares, 0, 0, signer.address);
}

const addBaseLiquidity = async (signer, percentage) => {

    const slotInfo = await poolInstance.slot0();
    const tickSpacing = await poolInstance.tickSpacing();

    let currentTick = slotInfo.tick;
    currentTick = parseInt((currentTick) / tickSpacing) * tickSpacing;

    let upperTick = currentTick + 100 * tickSpacing;
    let lowerTick = currentTick - 100 * tickSpacing;

    await routerInstance.connect(signer).newBaseLiquidity(lowerTick, upperTick, percentage, true);

}

const addLimitLiquidity = async (signer, percentage) => {

    const slotInfo = await poolInstance.slot0();
    const tickSpacing = await poolInstance.tickSpacing();

    let currentTick = slotInfo.tick;
    currentTick = parseInt((currentTick) / tickSpacing) * tickSpacing;

    let upperTick = currentTick + 500 * tickSpacing;
    let lowerTick = currentTick + 100 * tickSpacing;

    await routerInstance.connect(signer).newLimitLiquidity(lowerTick, upperTick, percentage);

}

const performSwaps = async (signer) => {
    let overrides = {value: ethers.utils.parseEther("100")};
    await WETH.connect(signer).deposit(overrides);
    await WETH.connect(signer).approve(uniRouterInstance.address, ethers.constants.MaxUint256)
    await DAI.connect(signer).approve(uniRouterInstance.address, ethers.constants.MaxUint256)

    const swapCount = 5;
    let count = 0;

    while(count < swapCount) {
        await uniRouterInstance.connect(signer).exactInputSingle(await swapEthToDaiParams(signer));
        await uniRouterInstance.connect(signer).exactInputSingle(await swapDaiToEthParams(signer));
        count++;
    }
    await uniRouterInstance.connect(signer).exactInputSingle(await swapEthToDaiParams(signer));

}

const swapEthToDaiParams = async (signer) => {
    const amountInWeth = await WETH.balanceOf(signer.address);
    return {
        tokenIn: WETH.address,
        tokenOut: DAI.address,
        fee: poolFee,
        recipient: signer.address,
        deadline:2541704532,
        amountIn: amountInWeth,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0 
    };
}

const swapDaiToEthParams = async (signer) => {
    const amountInDai = await DAI.balanceOf(signer.address);
    return {
        tokenIn: DAI.address,
        tokenOut: WETH.address,
        fee: poolFee,
        recipient: signer.address,
        deadline:2541704532,
        amountIn: amountInDai,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0 
    };
}




describe("Initialize Vault", async () => {    
    before(async () => {
        await deploy();
    });

    it('Should have correct pool', async () => {
        checkEqual(await rebalancerInstance.pool(), MAINNET_POOL_DAI_WETH);
    });

    it('Should have correct fee', async () => {
        checkEqual(await rebalancerInstance.protocolFee(), fee);
    });

    it('Should have correct token0', async () => {
        checkEqual(await rebalancerInstance.token0(), await poolInstance.token0());
    });

    it('Should have correct token1', async () => {
        checkEqual(await rebalancerInstance.token1(), await poolInstance.token1());
    });

    it('Should have correct tickSpacing', async () => {
        checkEqual(await rebalancerInstance.tickSpacing(), await poolInstance.tickSpacing());
    });

    it('Should have correct governance', async () => {
        checkEqual(await rebalancerInstance.governance(), deployer.address);
    });

    it('zero values shouldnt be initialized', async () => {
        checkEqual(await rebalancerInstance.baseUpper(), 0);
        checkEqual(await rebalancerInstance.baseUpper(), 0);
        checkEqual(await rebalancerInstance.limitLower(), 0);
        checkEqual(await rebalancerInstance.limitUpper(), 0);
        checkEqual(await rebalancerInstance.accruedProtocolFees0(), 0);
        checkEqual(await rebalancerInstance.accruedProtocolFees1(), 0);
    });
});


describe("Deposit assets", async() => {
    beforeEach (async() => {
        await deploy();
        await getPoolFunds(addr1);    
    });

    it('Should receive LP tokens', async () => {
        const oldBal = await rebalancerInstance.balanceOf(addr1.address);
        await depositToVault(addr1);
        const newBal = await rebalancerInstance.balanceOf(addr1.address);
        checkAbove(newBal,oldBal);
    });

    it('One token is fully deposited', async () => {
        const DAIBalOld = await DAI.balanceOf(addr1.address);
        const WETHBalOld = await WETH.balanceOf(addr1.address);
        await depositToVault(addr1);
        const DAIBalNew = await DAI.balanceOf(addr1.address);
        const WETHBalNew = await WETH.balanceOf(addr1.address);

        checkBelow(DAIBalNew, DAIBalOld);
        checkBelow(WETHBalNew, WETHBalOld);
    });
})


describe("Withdraw assets", async() => {
    beforeEach (async() => {
        await deploy();
        await getPoolFunds(addr1);
        await depositToVault(addr1);
    });

    it('User\'s shares decrease', async () => {
        const oldShares = await rebalancerInstance.balanceOf(addr1.address);
        await withdrawFromVault(addr1);
        const newShares = await rebalancerInstance.balanceOf(addr1.address);
        checkBelow(newShares,oldShares);
    });

    it('User receives assets back', async () => {
        const DAIBalOld = await DAI.balanceOf(addr1.address);
        const WETHBalOld = await WETH.balanceOf(addr1.address);

        await withdrawFromVault(addr1);

        const DAIBalNew = await DAI.balanceOf(addr1.address);
        const WETHBalNew = await WETH.balanceOf(addr1.address);

        checkAbove(DAIBalNew, DAIBalOld);
        checkAbove(WETHBalNew, WETHBalOld);
    });
})

describe("Adding Base Liquidity", async() => {
    beforeEach (async() => {
        await deploy();
        await getPoolFunds(addr1);
        await depositToVault(addr1);
    });

    it('SM should be able to add liquidity', async () => {
        const oldLiquidity = await routerInstance.getBaseAmounts(rebalancerInstance.address);
        await addBaseLiquidity(strategy, 100);
        const newLiquidity = await routerInstance.getBaseAmounts(rebalancerInstance.address);

        checkAbove(newLiquidity.liquidity,oldLiquidity.liquidity);     
    });

    it('User should be able to deposit funds directly to current liquidity position', async () => {
        
        await addBaseLiquidity(strategy, 100);
        const oldLiquidity = await routerInstance.getBaseAmounts(rebalancerInstance.address);
        await getPoolFunds(addr4);
        await depositToVault(addr4);
        const newLiquidity = await routerInstance.getBaseAmounts(rebalancerInstance.address);

        checkAbove(newLiquidity.liquidity,oldLiquidity.liquidity);     
    });

    it('SM should be able burn and add new liquidity', async () => {
        await addBaseLiquidity(strategy, 100);
        const oldLiquidity = await routerInstance.getBaseTicks(rebalancerInstance.address);
        // console.log(oldLiquidity);
        await performSwaps(addr3);
        await addBaseLiquidity(strategy, 100);
        const newLiquidity = await routerInstance.getBaseTicks(rebalancerInstance.address);

        checkUnEqual(oldLiquidity[0], newLiquidity[0]);
        checkUnEqual(oldLiquidity[1], newLiquidity[1]);
    });

    it('Random address should not be able to add liquidity', async () => {
        await checkRevert(addBaseLiquidity(addr1, 100), 'valid vault');
    })

    it('Correct percentage of funds should be deployed', async () => {
        const oldDaiBal = await rebalancerInstance.getBalance0();
        const oldEthBal = await rebalancerInstance.getBalance1();
        await addBaseLiquidity(strategy, 100);
        const newDaiBal = await rebalancerInstance.getBalance0();
        const newEthBal = await rebalancerInstance.getBalance1();
        checkBelow(newDaiBal, oldDaiBal);
        checkBelow(newEthBal, oldEthBal);
    })

})

describe("Adding Limit Liquidity", async() => {
    beforeEach (async() => {
        await deploy();
        await getPoolFunds(addr1);
        await depositToVault(addr1);
    });

    it('SM should be able to add liquidity', async () => {
        const oldLiquidity = await routerInstance.getLimitAmounts(rebalancerInstance.address);
        await addLimitLiquidity(strategy, 100);
        const newLiquidity = await routerInstance.getLimitAmounts(rebalancerInstance.address);

        checkAbove(newLiquidity.liquidity,oldLiquidity.liquidity);     
    });

    it('User should be able to deposit funds directly to current liquidity position', async () => {
        
        await addLimitLiquidity(strategy, 100);
        const oldLiquidity = await routerInstance.getLimitAmounts(rebalancerInstance.address);
        await getPoolFunds(addr4);
        await depositToVault(addr4);
        const newLiquidity = await routerInstance.getLimitAmounts(rebalancerInstance.address);

        checkAbove(newLiquidity.liquidity,oldLiquidity.liquidity);     
    });

    it('SM should be able burn and add new liquidity', async () => {
        await addLimitLiquidity(strategy, 100);
        const oldLiquidity = await routerInstance.getLimitTicks(rebalancerInstance.address);
        // console.log(oldLiquidity);
        await performSwaps(addr3);
        await addLimitLiquidity(strategy, 100);
        const newLiquidity = await routerInstance.getLimitTicks(rebalancerInstance.address);

        checkUnEqual(oldLiquidity[0], newLiquidity[0]);
        checkUnEqual(oldLiquidity[1], newLiquidity[1]);
    });

    it('Random address should not be able to add liquidity', async () => {
        await checkRevert(addLimitLiquidity(addr1, 100), 'valid vault');
    })

    it('Correct percentage of funds should be deployed', async () => {
        const oldDaiBal = await rebalancerInstance.getBalance0();
        const oldEthBal = await rebalancerInstance.getBalance1();
        await addLimitLiquidity(strategy, 100);
        const newDaiBal = await rebalancerInstance.getBalance0();
        const newEthBal = await rebalancerInstance.getBalance1();
        checkBelow(newDaiBal, oldDaiBal);
        // checkBelow(newEthBal, oldEthBal);
    })

})


describe("Earning Swap Fee", async() => {
    beforeEach(async() => {
        await deploy();
        await getPoolFunds(addr1);
        await depositToVault(addr1);
        await addBaseLiquidity(strategy, 100);
        await performSwaps(addr3);
    });

    it('Vault earns fees after rebalance', async () => {
        const oldDaiBal = await rebalancerInstance.getBalance0();
        const oldEthBal = await rebalancerInstance.getBalance1();
        // Removing position and collecting fee
        await addBaseLiquidity(strategy, 0);
        const newDaiBal = await rebalancerInstance.getBalance0();
        const newEthBal = await rebalancerInstance.getBalance1();
        checkAbove(newDaiBal,oldDaiBal);
        checkAbove(newEthBal,oldEthBal);     
    });

    it('SM earns fees after rebalance', async () => {
        const oldDaiBal = await rebalancerInstance.accruedStrategyFees0();
        const oldEthBal = await rebalancerInstance.accruedStrategyFees1();
        // Removing position and collecting fee
        await addBaseLiquidity(strategy, 0);
        const newDaiBal = await rebalancerInstance.accruedStrategyFees0();
        const newEthBal = await rebalancerInstance.accruedStrategyFees1();
        checkAbove(newDaiBal,oldDaiBal);
        checkAbove(newEthBal,oldEthBal);
    });

    it('Protocol earns fees after rebalance', async () => {
        const oldDaiBal = await rebalancerInstance.accruedProtocolFees0();
        const oldEthBal = await rebalancerInstance.accruedProtocolFees1();
        // Removing position and collecting fee
        await addBaseLiquidity(strategy, 0);
        const newDaiBal = await rebalancerInstance.accruedProtocolFees0();
        const newEthBal = await rebalancerInstance.accruedProtocolFees1();
        checkAbove(newDaiBal,oldDaiBal);
        checkAbove(newEthBal,oldEthBal);     
    });

})

// describe("Managing liquidity", async() => {
//     beforeEach (async() => {
//         await deploy();
//         await getPoolFunds(addr1);
//         await depositToVault(addr1);
//         await addBaseLiquidity(strategy, 100);
//     });

//     it('SM can decrease liquidity at current position', async () => {
//         const oldLiquidity = await rebalancerInstance.getBaseLiquidity();
//         await rebalancerInstance.connect(strategy).decreaseLiquidityPercentage(true, 50);
//         const newLiquidity = await rebalancerInstance.getBaseLiquidity();
//         checkBelow(newLiquidity.liquidity,oldLiquidity.liquidity);
//     });

//     it('SM can increase liquidity at current position', async () => {  
//         await rebalancerInstance.connect(strategy).decreaseLiquidityPercentage(true, 50);
//         const oldLiquidity = await rebalancerInstance.getBaseLiquidity();
//         await rebalancerInstance.connect(strategy).increaseLiquidityPercentage(true, 100);
//         const newLiquidity = await rebalancerInstance.getBaseLiquidity();
//         checkAbove(newLiquidity.liquidity,oldLiquidity.liquidity);
//     });
// })



describe("Collecting Fee", async() => {
    beforeEach(async() => {
        await deploy();
        await getPoolFunds(addr1);

    });

    it('Depositers earn fee after withdraw', async () => {
        const oldDaiBal = await DAI.balanceOf(addr1.address);
        const oldEthBal = await WETH.balanceOf(addr1.address);
        await depositToVault(addr1);

        await addBaseLiquidity(strategy, 100);
        await performSwaps(addr3);
        await addBaseLiquidity(strategy, 100);

        await withdrawFromVault(addr1);
        const newDaiBal = await DAI.balanceOf(addr1.address);
        const newEthBal = await WETH.balanceOf(addr1.address);

        // One amount could be lower due to IL
        checkAbove(newEthBal,oldEthBal) || checkAbove(newDaiBal,oldDaiBal);     
    });

    it('SM can collect and compound fee', async () => {
        await depositToVault(addr1);
        await addBaseLiquidity(strategy, 100);
        const oldLiquidity = await routerInstance.getBaseAmounts(rebalancerInstance.address);
        await performSwaps(addr3);
        await routerInstance.connect(strategy).compoundFee(rebalancerInstance.address);
        const newLiquidity = await routerInstance.getBaseAmounts(rebalancerInstance.address);

        checkAbove(newLiquidity.liquidity, oldLiquidity.liquidity);
    })

    it('Governance can collect fee', async () => {
        await depositToVault(addr1);
        await addBaseLiquidity(strategy, 100);
        await performSwaps(addr3);
        await addBaseLiquidity(strategy, 100);

        const oldDaiBal = await DAI.balanceOf(addr1.address);
        const oldEthBal = await WETH.balanceOf(addr1.address);

        const feeToken0 = await rebalancerInstance.accruedProtocolFees0();
        const feeToken1 = await rebalancerInstance.accruedProtocolFees1();
        await rebalancerInstance.connect(deployer).collectProtocol(feeToken0, feeToken1, addr1.address);

        const newDaiBal = await DAI.balanceOf(addr1.address);
        const newEthBal = await WETH.balanceOf(addr1.address);

        checkAbove(newEthBal, oldEthBal) || checkAbove(newDaiBal, oldDaiBal);
    });

    it('No random address can collect governance fee', async () => {
        const feeToken0 = await rebalancerInstance.accruedProtocolFees0();
        const feeToken1 = await rebalancerInstance.accruedProtocolFees1();
        checkRevert(rebalancerInstance.connect(addr1).collectProtocol(feeToken0, feeToken1, addr1.address), 'governance');

    });

    it('Strategy can collect fee', async () => {
        await depositToVault(addr1);
        await addBaseLiquidity(strategy, 100);
        await performSwaps(addr3);
        await addBaseLiquidity(strategy, 0);

        const oldDaiBal = await DAI.balanceOf(addr1.address);
        const oldEthBal = await WETH.balanceOf(addr1.address);

        const feeToken0 = await rebalancerInstance.accruedStrategyFees0();
        const feeToken1 = await rebalancerInstance.accruedStrategyFees1();
        await rebalancerInstance.connect(strategy).collectStrategy(feeToken0, feeToken1, addr1.address);

        const newDaiBal = await DAI.balanceOf(addr1.address);
        const newEthBal = await WETH.balanceOf(addr1.address);

        checkAbove(newEthBal, oldEthBal) || checkAbove(newDaiBal, oldDaiBal);
    });

    it('No random address can collect strategy fee', async () => {
        const feeToken0 = await rebalancerInstance.accruedStrategyFees0();
        const feeToken1 = await rebalancerInstance.accruedStrategyFees1();
        checkRevert(rebalancerInstance.connect(addr1).collectStrategy(feeToken0, feeToken1, addr1.address), 'router');

    });

})

describe('Governance operations', async () => {
    beforeEach(async() => {
        await deploy();
        await getPoolFunds(addr1);
    });

    it('Can set maxTotalSupply', async () => {
        rebalancerInstance.setMaxTotalSupply(100000);
        checkEqual(await rebalancerInstance.maxTotalSupply(), 100000);
    });

    it('No random address can setMaxTotalSupply', async () => {
        checkRevert(rebalancerInstance.connect(addr1).setMaxTotalSupply(99), 'governance');
    });

    it('Can set freezeStrategy', async () => {
        rebalancerInstance.freezeStrategy(true);
        checkEqual(await rebalancerInstance.pauseStrategy(), true);
        await depositToVault(addr1);
        checkRevert(addBaseLiquidity(strategy, 100), 'paused');
    });

    it('No random address can freezeStrategy', async () => {
        checkRevert(rebalancerInstance.connect(addr1).freezeStrategy(true), 'governance');
    });

    it('Can set freezeUser', async () => {
        rebalancerInstance.freezeUser(true);
        checkEqual(await rebalancerInstance.pauseUser(), true);
        checkRevert(depositToVault(addr1), 'paused');
    });

    it('No random address can freezeUser', async () => {
        checkRevert(rebalancerInstance.connect(addr1).freezeUser(true), 'governance');
    });

    it('Can do emergencyBurnAndCollect', async () => {
        await depositToVault(addr1);
        await addBaseLiquidity(strategy, 100);
        await getPoolFunds(addr1);
        await depositToVault(addr1);
        await addLimitLiquidity(strategy, 100);

        const oldDaiBal = await DAI.balanceOf(addr5.address);
        const oldEthBal = await WETH.balanceOf(addr5.address);

        rebalancerInstance.emergencyBurnAndCollect(addr5.address);
        checkEqual(await rebalancerInstance.getBalance0(), 0);
        checkEqual(await rebalancerInstance.getBalance1(), 0);

        const newDaiBal = await DAI.balanceOf(addr5.address);
        const newEthBal = await WETH.balanceOf(addr5.address);

        checkAbove(newEthBal, oldEthBal);
        checkAbove(newDaiBal, oldDaiBal);
    });

    it('No random address can do emergencyBurnAndCollect', async () => {
        await depositToVault(addr1);
        await addBaseLiquidity(strategy, 100);
        await getPoolFunds(addr1);
        await depositToVault(addr1);
        await addLimitLiquidity(strategy, 100);

        checkRevert(rebalancerInstance.connect(addr5).emergencyBurnAndCollect(addr5.address), 'governance');

    });
})


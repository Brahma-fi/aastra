// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.5;
pragma abicoder v2;

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import '@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol';
import "@openzeppelin/contracts/math/SafeMath.sol";
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import './interfaces/IVault.sol';
import "./interfaces/IERC20Metadata.sol";
import "./libraries/LongMath.sol";

contract Periphery {
    using SafeMath for uint256;
    using LongMath for uint256;
    using SafeERC20 for IERC20Metadata;
    using SafeERC20 for IVault;

    ISwapRouter public immutable swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    IQuoter public immutable quoter = IQuoter(0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6);
    
    IVault public vault;
    uint24 public poolFee;
    IERC20Metadata public token0;
    IERC20Metadata public token1;

    constructor(IVault _vault) {
        vault = _vault;
        poolFee = vault.pool().fee();
        token0 = vault.token0();
        token1 = vault.token1();
    } 

    /// @notice Calls IVault's deposit method and sends all money back to user after transactions
    /// @param amountIn Value of token0 to be deposited 
    function vaultDeposit(uint256 amountIn) external minimumAmount(amountIn) {
        // Calculate amount to swap based on tokens in vault
        // token0 / token1 = k
        // token0 + token1 = amountIn
        uint256 amountToSwap;
        (uint256 token0InVault, uint256 token1InVault) = vault.getTotalAmounts();
        
        if(token0InVault == 0 || token1InVault == 0) {
            amountToSwap = amountIn/2;
        } else {
            uint256 tokensRatio = token1InVault.mul(100).div(token0InVault);
            uint256 token0ToKeep = amountIn.mul(100*100).div(tokensRatio.add(1*100));
            amountToSwap = (amountIn.mul(100) - token0ToKeep).div(100);
        }

        // transfer token0 from sender to contract & approve router to spend it
        token0.safeTransferFrom(msg.sender, address(this), amountIn);
        token0.approve(address(swapRouter), amountToSwap);

        // swap token0 for token1
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: address(token0),
                tokenOut: address(token1),
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amountToSwap,
                amountOutMinimum: quoter.quoteExactInputSingle(
                    address(token0), 
                    address(token1), 
                    poolFee, 
                    amountToSwap, 
                    0
                ),
                sqrtPriceLimitX96: 0
            });
        uint256 amountOut = swapRouter.exactInputSingle(params);

        // deposit token0 & token1 in vault
        token0.approve(address(vault), _tokenBalance(token0));
        token1.approve(address(vault), amountOut);

        vault.deposit(_tokenBalance(token0), amountOut, 0, 0, msg.sender);

        // send balance of token1 & token0 to user
        token0.safeTransfer(msg.sender, _tokenBalance(token0));
        token1.safeTransfer(msg.sender, _tokenBalance(token1));
    }

    function vaultWithdraw(uint256 shares) external minimumAmount(shares) {
        // transfer shares from msg.sender & withdraw
        vault.safeTransferFrom(msg.sender, address(this), shares);
        (uint256 amount0, uint256 amount1) = vault.withdraw(shares, 0, 0, address(this));

        token1.approve(address(swapRouter), amount1);

        // swap token0 for token1
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: address(token1),
                tokenOut: address(token0),
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amount1,
                amountOutMinimum: quoter.quoteExactInputSingle(
                    address(token1), 
                    address(token0), 
                    poolFee, 
                    amount1, 
                    0
                ),
                sqrtPriceLimitX96: 0
            });
        uint256 amountOut = swapRouter.exactInputSingle(params);

        // send balance of token1 & token0 to user
        token0.safeTransfer(msg.sender, _tokenBalance(token0));
        token1.safeTransfer(msg.sender, _tokenBalance(token1));
    }

    function _tokenBalance(IERC20Metadata token) internal view returns (uint256) {
        return token.balanceOf(address(this));
    }

    modifier minimumAmount(uint256 amountIn) {
        require(amountIn > 0, "amountIn not sufficient");
        _;
    }
}
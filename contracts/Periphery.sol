// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.5;
pragma abicoder v2;

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import '@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import './interfaces/IVault.sol';
import "./interfaces/IERC20Metadata.sol";

contract Periphery {
    using SafeERC20 for IERC20Metadata;

    ISwapRouter public immutable swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    IQuoter public immutable quoter = IQuoter(0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6);
    IVault public vault;

    constructor(IVault _vault) {
        vault = _vault;
    } 

    /// @notice Calls IVault's deposit method and sends all money back to user after transactions
    /// @param amountIn Value of token0 to be deposited 
    function vaultDeposit(uint256 amountIn) external minimumAmount(amountIn) {
        uint24 poolFee = vault.pool().fee();
        IERC20Metadata token0 = vault.token0();
        IERC20Metadata token1 = vault.token1();
        uint256 amountToSwap = amountIn/2;

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

        vault.deposit(amountToSwap, amountOut, 0, 0, msg.sender);

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
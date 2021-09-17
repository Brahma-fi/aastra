// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.5;
pragma abicoder v2;

import "./IERC20Metadata.sol";

/**
 * @title IPeriphery
 * @notice A middle layer between user and Aastra Vault to process transactions
 * @dev Provides an interface for Periphery
 */
interface IPeriphery {
    /**
     * @notice Calls IVault's deposit method and sends all money back to 
     * user after transactions
     * @param amountIn Value of token0 to be deposited 
     */
    function vaultDeposit(uint256 amountIn) external;

    /**
      * @notice Calls vault's withdraw function in exchange for shares
      * and transfers processed token0 value to msg.sender
      * @param shares Value of shares in exhange for which tokens are withdrawn
     */
    function vaultWithdraw(uint256 shares) external;
}
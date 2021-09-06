Aastra Vault is a Uniswap V3 liquidity management vault enabling you to automate yield generation on your idle funds

Provides an interface to the Aastra Vault

## Functions
### token0
```solidity
function token0(
) external returns (contract IERC20Metadata)
```
Retrieve first token of Uniswap V3 pool



#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`IERC20Metadata`| contract IERC20Metadata | token address
### token1
```solidity
function token1(
) external returns (contract IERC20Metadata)
```
Retrieve second token of Uniswap V3 pool



#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`IERC20Metadata`| contract IERC20Metadata | token address
### getBalance0
```solidity
function getBalance0(
) external returns (uint256)
```
Retrieve usable amount of token0 available in the vault



#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`amount0`| uint256 | Amount of token0
### getBalance1
```solidity
function getBalance1(
) external returns (uint256)
```
Retrieve usable amount of token1 available in the vault



#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`amount1`| uint256 | Amount of token0
### tickSpacing
```solidity
function tickSpacing(
) external returns (int24)
```
Retrieve tickSpacing of Pool used in the vault



#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`tickSpacing`| int24 | tickSpacing of the Uniswap V3 pool
### baseLower
```solidity
function baseLower(
) external returns (int24)
```
Retrieve lower tick of base position of Pool used in the vault



#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`baseLower`| int24 | of the Uniswap V3 pool
### baseUpper
```solidity
function baseUpper(
) external returns (int24)
```
Retrieve upper tick of base position of Pool used in the vault



#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`baseUpper`| int24 | of the Uniswap V3 pool
### limitLower
```solidity
function limitLower(
) external returns (int24)
```
Retrieve lower tick of limit position of Pool used in the vault



#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`limitLower`| int24 | of the Uniswap V3 pool
### limitUpper
```solidity
function limitUpper(
) external returns (int24)
```
Retrieve upper tick of limit position of Pool used in the vault



#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`limitUpper`| int24 | of the Uniswap V3 pool
### pool
```solidity
function pool(
) external returns (contract IUniswapV3Pool)
```
Retrieve address of Uni V3 Pool used in the vault



#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`IUniswapV3Pool`| contract IUniswapV3Pool | address of Uniswap V3 Pool
### factory
```solidity
function factory(
) external returns (contract IFactory)
```
Retrieve address of Factory used to create the vault



#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`IFactory`| contract IFactory | address of Aastra factory contract
### router
```solidity
function router(
) external returns (address)
```
Retrieve address of current router in Aastra



#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`router`| address | address of Aastra router contract
### strategy
```solidity
function strategy(
) external returns (address)
```
Retrieve address of strategy manager used to manage the vault



#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`manager`| address | address of vault manager
### getTotalAmounts
```solidity
function getTotalAmounts(
) external returns (uint256, uint256)
```
Calculates the vault's total holdings of token0 and token1 - in
other words, how much of each token the vault would hold if it withdrew
all its liquidity from Uniswap.



#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`total0`| uint256 | Total token0 holdings of the vault
|`total1`| uint256 | Total token1 holdings of the vault
### position
```solidity
function position(
int24 tickLower,
int24 tickUpper
) external returns (uint128, uint256, uint256, uint128, uint128)
```
Provides the current data on a position in the vault according to lower and upper tick

Wrapper around `IUniswapV3Pool.positions()`.


#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`tickLower` | int24 | Lower tick of the vault's position
|`tickUpper` | int24 | Upper tick of the vault's position

### getPositionAmounts
```solidity
function getPositionAmounts(
int24 tickLower,
int24 tickUpper
) external returns (uint256 amount0, uint256 amount1)
```
Amounts of token0 and token1 held in vault's position. Includes owed fees but excludes the proportion of fees that will be paid to the protocol. Doesn't include fees accrued since last poke.



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`tickLower` | int24 | Lower tick of the vault's position
|`tickUpper` | int24 | Upper tick of the vault's position

#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`amount0`| uint256 | Amount of token0 held in the vault's position
|`amount1`| uint256 | Amount of token1 held in the vault's position
### poke
```solidity
function poke(
int24 tickLower,
int24 tickUpper
) external
```
Updates due amount in uniswap owed for a tick range

Do zero-burns to poke a position on Uniswap so earned fees are updated. Should be called if total amounts needs to include up-to-date fees.


#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`tickLower` | int24 | Lower bound of the tick range
|`tickUpper` | int24 | Upper bound of the tick range

### setBaseTicks
```solidity
function setBaseTicks(
int24 _baseLower,
int24 _baseUpper
) external
```
Used to update the new base position ticks of the vault



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`_baseLower` | int24 | The new lower tick of the vault
|`_baseUpper` | int24 | The new upper tick of the vault

### setRangeTicks
```solidity
function setRangeTicks(
int24 _limitLower,
int24 _limitUpper
) external
```
Used to update the new limit position ticks of the vault



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`_limitLower` | int24 | The new lower tick of the vault
|`_limitUpper` | int24 | The new upper tick of the vault

### burnAndCollect
```solidity
function burnAndCollect(
int24 tickLower,
int24 tickUpper,
uint128 liquidity
) external returns (uint256 burned0, uint256 burned1, uint256 feesToVault0, uint256 feesToVault1)
```
Withdraws all liquidity from a range and collects all the fees in the process



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`tickLower` | int24 | Lower bound of the tick range
|`tickUpper` | int24 | Upper bound of the tick range
|`liquidity` | uint128 | Liquidity to be withdrawn from the range

#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`burned0`| uint256 | Amount of token0 that was burned
|`burned1`| uint256 | Amount of token1 that was burned
|`feesToVault0`| uint256 | Amount of token0 fees vault earned
|`feesToVault1`| uint256 | Amount of token1 fees vault earned
### mintOptimalLiquidity
```solidity
function mintOptimalLiquidity(
int24 _lowerTick,
int24 _upperTick,
uint256 amount0,
uint256 amount1
) external
```
This method will optimally use all the funds provided in argument to mint the maximum possible liquidity



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`_lowerTick` | int24 | Lower bound of the tick range
|`_upperTick` | int24 | Upper bound of the tick range
|`amount0` | uint256 | Amount of token0 to be used for minting liquidity
|`amount1` | uint256 | Amount of token1 to be used for minting liquidity

### swapTokensFromPool
```solidity
function swapTokensFromPool(
bool direction,
uint256 amountInToSwap
) external returns (uint256 amountOut)
```
Swaps tokens from the pool



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`direction` | bool | The direction of the swap, true for token0 to token1, false for reverse
|`amountInToSwap` | uint256 | Desired amount of token0 or token1 wished to swap

#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`amountOut`| uint256 | Amount of token0 or token1 received from the swap
### compoundFee
```solidity
function compoundFee(
) external
```
Collects liquidity fee earned from both positions of vault and reinvests them back into the same position



### collectStrategy
```solidity
function collectStrategy(
uint256 amount0,
uint256 amount1,
address to
) external
```
Used to collect accumulated strategy fees.



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`amount0` | uint256 | Amount of token0 to collect
|`amount1` | uint256 | Amount of token1 to collect
|`to` | address | Address to send collected fees to

### freezeStrategy
```solidity
function freezeStrategy(
bool value
) external
```
Emergency method to freeze actions performed by a strategy



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`value` | bool | To be set to true in case of active freeze

### freezeUser
```solidity
function freezeUser(
bool value
) external
```
Emergency method to freeze actions performed by a vault user



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`value` | bool | To be set to true in case of active freeze

### collectProtocol
```solidity
function collectProtocol(
uint256 amount0,
uint256 amount1,
address to
) external
```
Used to collect accumulated protocol fees.



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`amount0` | uint256 | Amount of token0 to collect
|`amount1` | uint256 | Amount of token1 to collect
|`to` | address | Address to send collected fees to

### setMaxTotalSupply
```solidity
function setMaxTotalSupply(
uint256 _maxTotalSupply
) external
```
Used to change deposit cap for a guarded launch or to ensure
vault doesn't grow too large relative to the pool. Cap is on total
supply rather than amounts of token0 and token1 as those amounts
fluctuate naturally over time.



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`_maxTotalSupply` | uint256 | The new max total cap of the vault

### emergencyBurnAndCollect
```solidity
function emergencyBurnAndCollect(
address to
) external
```
Removes liquidity in case of emergency.



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`to` | address | Address to withdraw funds to

### deposit
```solidity
function deposit(
uint256 amount0Desired,
uint256 amount1Desired,
uint256 amount0Min,
uint256 amount1Min,
address to
) external returns (uint256 shares, uint256 amount0, uint256 amount1)
```
Deposits tokens in proportion to the vault's current holdings.



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`amount0Desired` | uint256 | Max amount of token0 to deposit
|`amount1Desired` | uint256 | Max amount of token1 to deposit
|`amount0Min` | uint256 | Revert if resulting `amount0` is less than this
|`amount1Min` | uint256 | Revert if resulting `amount1` is less than this
|`to` | address | Recipient of shares

#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`shares`| uint256 | Number of shares minted
|`amount0`| uint256 | Amount of token0 deposited
|`amount1`| uint256 | Amount of token1 deposited
### withdraw
```solidity
function withdraw(
uint256 shares,
uint256 amount0Min,
uint256 amount1Min,
address to
) external returns (uint256 amount0, uint256 amount1)
```
Withdraws tokens in proportion to the vault's holdings.



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`shares` | uint256 | Shares burned by sender
|`amount0Min` | uint256 | Revert if resulting `amount0` is smaller than this
|`amount1Min` | uint256 | Revert if resulting `amount1` is smaller than this
|`to` | address | Recipient of tokens

#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`amount0`| uint256 | Amount of token0 sent to recipient
|`amount1`| uint256 | Amount of token1 sent to recipient
## Events
### Deposit
```solidity
event Deposit(
address sender,
address to,
uint256 shares,
uint256 amount0,
uint256 amount1
)
```
Emitted when a deposit made to a vault


#### Parameters:
| Name | Type | Description |
| :----------------------------- | :------------ | :--------------------------------------------- |
|`sender`| address | The sender of the deposit transaction
|`to`| address | The recipient of LP tokens
|`shares`| uint256 | Amount of LP tokens paid to recipient
|`amount0`| uint256 | Amount of token0 deposited
|`amount1`| uint256 | Amount of token1 deposited
### Withdraw
```solidity
event Withdraw(
address sender,
address to,
uint256 shares,
uint256 amount0,
uint256 amount1
)
```
Emitted when a withdraw made to a vault


#### Parameters:
| Name | Type | Description |
| :----------------------------- | :------------ | :--------------------------------------------- |
|`sender`| address | The sender of the withdraw transaction
|`to`| address | The recipient of withdrawn amounts
|`shares`| uint256 | Amount of LP tokens paid back to vault
|`amount0`| uint256 | Amount of token0 withdrawn
|`amount1`| uint256 | Amount of token1 withdrawn
### CollectFees
```solidity
event CollectFees(
uint256 feesToVault0,
uint256 feesToVault1,
uint256 feesToStrategy0,
uint256 feesToStrategy1
)
```
Emitted when fees collected from uniswap


#### Parameters:
| Name | Type | Description |
| :----------------------------- | :------------ | :--------------------------------------------- |
|`feesToVault0`| uint256 | Amount of token0 earned as fee by protocol
|`feesToVault1`| uint256 | Amount of token1 earned as fee by protocol
|`feesToStrategy0`| uint256 | Amount of token0 earned as fee by strategy manager
|`feesToStrategy1`| uint256 | Amount of token1 earned as fee by strategy manager

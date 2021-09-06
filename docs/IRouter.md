Aastra Router provides simple interface for SM to interact with vault


## Functions
### factory
```solidity
function factory(
) external returns (contract IFactory)
```
returns address of Aastra factory contract



#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`IFactory`| contract IFactory | Address of aastra factory contract
### getBaseAmounts
```solidity
function getBaseAmounts(
address vault
) external returns (uint128 liquidity, uint256 amount0, uint256 amount1)
```
Retrieve amounts present in base position



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`vault` | address | Address of the vault

#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`liquidity`| uint128 | Liquidity amount of the position
|`amount0`| uint256 | Amount of token0 present in the position after last poke
|`amount1`| uint256 | Amount of token1 present in the position after last poke
### getRangeAmounts
```solidity
function getRangeAmounts(
address vault
) external returns (uint128 liquidity, uint256 amount0, uint256 amount1)
```
Retrieve amounts present in limit position



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`vault` | address | Address of the vault

#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`liquidity`| uint128 | Liquidity amount of the position
|`amount0`| uint256 | Amount of token0 present in the position after last poke
|`amount1`| uint256 | Amount of token1 present in the position after last poke
### newBaseLiquidity
```solidity
function newBaseLiquidity(
int24 _baseLower,
int24 _baseUpper,
uint8 _percentage,
bool swapEnabled
) external
```
Used to create a new base liquidity position on uniswap. This will burn and remove any existing position held by the vault 



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`_baseLower` | int24 | The lower limit of the liquidity position
|`_baseUpper` | int24 | The upper limit of the liquidity position
|`_percentage` | uint8 | The percentage of funds of the vault to be used for liquidity position
|`swapEnabled` | bool | Enable/disable the automatic swapping for optimal liqudity minting

### newLimitLiquidity
```solidity
function newLimitLiquidity(
int24 _limitLower,
int24 _limitUpper,
uint8 _percentage,
bool swapEnabled
) external
```
Used to create a new limit liquidity position on uniswap. This will burn and remove any existing position held by the vault 



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`_limitLower` | int24 | The lower limit of the liquidity position
|`_limitUpper` | int24 | The upper limit of the liquidity position
|`_percentage` | uint8 | The percentage of funds of the vault to be used for liquidity position
|`swapEnabled` | bool | Enable/disable the automatic swapping for optimal liqudity minting

### compoundFee
```solidity
function compoundFee(
address _vault
) external
```
Used to collect and compound fee for a specific vault



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`_vault` | address | Address of the vault

### getBaseTicks
```solidity
function getBaseTicks(
address vault
) external returns (int24 lowerTick, int24 upperTick)
```
Retrieve lower and upper ticks of vault\'s base position



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`vault` | address | Address of the vault

#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`lowerTick`| int24 | Lower limit of the vault\'s base position
|`upperTick`| int24 | Upper limit of the vault\'s base position
### getRangeTicks
```solidity
function getRangeTicks(
address vault
) external returns (int24 lowerTick, int24 upperTick)
```
Retrieve lower and upper ticks of vault\'s limit position



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`vault` | address | Address of the vault

#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`lowerTick`| int24 | Lower limit of the vault\'s limit position
|`upperTick`| int24 | Upper limit of the vault\'s limit position
## Events
### RebalanceBaseLiqudity
```solidity
event RebalanceBaseLiqudity(
address vault,
int24 baseLower,
int24 baseUpper,
uint8 percentage
)
```
Emitted on successfull rebalance of base liquidity of vault


#### Parameters:
| Name | Type | Description |
| :----------------------------- | :------------ | :--------------------------------------------- |
|`vault`| address | Address of aastra vault
|`baseLower`| int24 | Lower tick of new rebalanced liquidity
|`baseUpper`| int24 | Upper tick of new rebalanced liquidity
|`percentage`| uint8 | Percentage of funds to be used for rebalance
### RebalanceRangeLiqudity
```solidity
event RebalanceRangeLiqudity(
address vault,
int24 limitLower,
int24 limitUpper,
uint8 percentage
)
```
Emitted on successfull rebalance of base liquidity of vault


#### Parameters:
| Name | Type | Description |
| :----------------------------- | :------------ | :--------------------------------------------- |
|`vault`| address | Address of aastra vault
|`limitLower`| int24 | Lower tick of new rebalanced liquidity
|`limitUpper`| int24 | Upper tick of new rebalanced liquidity
|`percentage`| uint8 | Percentage of funds to be used for rebalance

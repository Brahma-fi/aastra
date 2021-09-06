Aastra Vault Factory deploys and manages Aastra Vaults. 

Provides an interface to the Aastra Vault Factory

## Functions
### vaultManager
```solidity
function vaultManager(
address _vault
) external returns (address _manager)
```
Returns manager address of a given vault address



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`_vault` | address | Address of Aastra vault

#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`_manager`| address | Address of vault manager
### managerVault
```solidity
function managerVault(
address _manager
) external returns (address _vault)
```
Returns vault address of a given manager address



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`_manager` | address | Address of vault manager

#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`_vault`| address | Address of Aastra vault
### createVault
```solidity
function createVault(
address _uniswapPool,
address _strategyManager,
uint256 _protocolFee,
uint256 _strategyFee,
uint256 _maxCappedLimit
) external
```
Creates a new Aastra vault



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`_uniswapPool` | address | Address of Uniswap V3 Pool
|`_strategyManager` | address | Address of strategy manager managing the vault
|`_protocolFee` | uint256 | Fee charged by strategy manager for the new vault
|`_strategyFee` | uint256 | Fee charged by protocol for the new vault
|`_maxCappedLimit` | uint256 | Max limit of TVL of the vault

### updateManager
```solidity
function updateManager(
address _newManager,
address _vault
) external
```
Sets a new manager for an existing vault



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`_newManager` | address | Address of the new manager for the vault
|`_vault` | address | Address of the Aastra vault

### router
```solidity
function router(
) external returns (address _router)
```
Returns the address of Router contract



#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`_router`| address | Address of Router contract
### governance
```solidity
function governance(
) external returns (address _governance)
```
Returns the address of protocol governance



#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`_governance`| address | Address of protocol governance
### pendingGovernance
```solidity
function pendingGovernance(
) external returns (address _pendingGovernance)
```
Returns the address of pending protocol governance



#### Return Values:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`_pendingGovernance`| address | Address of pending protocol governance
### setRouter
```solidity
function setRouter(
address _router
) external
```
Allows to upgrade the router contract to a new one



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`_router` | address | Address of the new router contract

### setGovernance
```solidity
function setGovernance(
address _governance
) external
```
Allows to set a new governance address



#### Parameters:
| Name | Type | Description |
| :--- | :--- | :------------------------------------------------------------------- |
|`_governance` | address | Address of the new protocol governance

### acceptGovernance
```solidity
function acceptGovernance(
) external
```
Function to be called by new governance method to accept the role



## Events
### VaultCreation
```solidity
event VaultCreation(
address strategyManager,
address uniswapPool,
address vaultAddress
)
```
Emitted when new vault created by factory


#### Parameters:
| Name | Type | Description |
| :----------------------------- | :------------ | :--------------------------------------------- |
|`strategyManager`| address | Address of strategyManager allocated to the vault
|`uniswapPool`| address | Address of uniswap pool tied to the vault
|`vaultAddress`| address | Address of the newly created vault

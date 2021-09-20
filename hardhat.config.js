require("@nomiclabs/hardhat-waffle");
require("hardhat-contract-sizer");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");

module.exports = {
  solidity: {
    version: "0.7.5",
    settings: {
      optimizer: {
        enabled: true,
        runs: 50
      }
    }
  },
  networks: {
    customRPC: {
      url: "https://rpc.tenderly.co/fork/50568bad-900c-402a-8d81-209f3da8c19c"
    },
    mainnetFork: {
      url: "http://13.234.43.171:8545/",
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
      ]
    }
  }
};

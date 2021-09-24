require("@nomiclabs/hardhat-waffle");
require("hardhat-contract-sizer");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");
const secrets = require("./secrets");

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
    hardhat: {
      forking: {
        url: `https://eth-kovan.alchemyapi.io/v2/${secrets.alchemyAPIKey}`
      }
    },
    customRPC: {
      url: "https://rpc.tenderly.co/fork/09375c58-4bf6-437f-8ace-9622a963722b",
      accounts: [`0x${secrets.privateKey}`]
    },
    mainnetFork: {
      url: "http://13.234.43.171:8545/",
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
      ]
    },
    kovan: {
      url: `https://kovan.infura.io/v3/d5ed64124bb0462a8675bdb92e707fd1`,
      accounts: [`0x${secrets.privateKey}`]
    }
  },
  etherscan: { apiKey: secrets.etherscanKey }
};

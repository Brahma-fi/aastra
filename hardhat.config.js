require("@nomiclabs/hardhat-waffle");
require('hardhat-contract-sizer');
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
};

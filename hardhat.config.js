require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  gasReporter: {
    enabled: true,
    gasPrice: 20
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  paths: {
    artifacts: "./artifacts",
  },
};

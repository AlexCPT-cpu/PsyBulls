require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");

/** @type import('hardhat/config').HardhatUserConfig */

const ALCHEMY_API_KEY = "https://polygon-mumbai.g.alchemy.com/v2/wZaczhJpJH7oi7OH5j6jgl5f2dkA4LfP"

const ethprivKey = "405f878100f0e507ae49eb23c3003ca592208c16670b06c61a60214f4990fa63"

module.exports = {
  etherscan: {
    apiKey: "ZEDRJJ2MYF1UKTN31QSW4P1H3V74A65DYH",
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    goerli: {
      chainId: 5,
      url: ALCHEMY_API_KEY,
      accounts: [ethprivKey]
    },
    mumbai: {
      chainId: 80001,
      url: ALCHEMY_API_KEY,
      accounts: [ethprivKey]
    },
    binance: {
      chainId: 57,
      url: "https://bscrpc.com",
      accounts: [ethprivKey]
    },
    bsctest: {
      chainId: 97,
      url: "https://data-seed-prebsc-1-s3.binance.org:8545",
      accounts: [ethprivKey]
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        },
      },
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        },
      },
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        },
      },
      {
        version: "0.8.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        },
      },
    ],
  }
};
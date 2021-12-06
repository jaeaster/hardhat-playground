import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
// eslint-disable-next-line node/no-missing-import
import "./tasks";

const accounts = {
  mnemonic:
    process.env.MNEMONIC ||
    "test test test test test test test test test test test junk",
};

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.7.5",
      },
      {
        version: "0.8.4",
      },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        enabled: true,
        url: "https://api.avax.network/ext/bc/C/rpc",
        blockNumber: 7856531,
      },
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts,
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts,
    },
    avalancheMainnet: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      accounts,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;

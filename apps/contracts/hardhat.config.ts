import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import { vars } from "hardhat/config";

const PRIVATE_KEY = vars.get("PRIVATE_KEY_2");
const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.30",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    celo: {
      url: "https://forno.celo.org",
      accounts: [PRIVATE_KEY],
      chainId: 42220,
    },
    celo_sepolia: {
      url: "https://forno.celo-sepolia.celo-testnet.org/",
      accounts: [PRIVATE_KEY],
      chainId: 11142220,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: {
      celo: ETHERSCAN_API_KEY,
      celo_sepolia: ETHERSCAN_API_KEY,
    },
  },
  // etherscan: {
  //   customChains: [
  //     {
  //       network: "celo",
  //       chainId: 42220,
  //       urls: {
  //         apiURL: "https://api.etherscan.io/v2/api",
  //         browserURL: "https://celoscan.io",
  //       },
  //     },
  //     {
  //       network: "celo-sepolia",
  //       chainId: 11142220,
  //       urls: {
  //         apiURL: "https://api.etherscan.io/v2/api",
  //         browserURL: "https://sepolia.celoscan.io/",
  //       },
  //     },
  //   ],
  // },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};

export default config;

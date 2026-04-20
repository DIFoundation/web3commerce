import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import { vars } from "hardhat/config";

const PRIVATE_KEY = vars.get("PRIVATE_KEY");
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
      accounts: [PRIVATE_KEY],
      chainId: 42220,
      url: "https://celo-mainnet.gateway.tatum.io"
    },
    celo_sepolia: {
      accounts: [PRIVATE_KEY],
      chainId: 11142220,
      url: "https://rpc.ankr.com/celo_sepolia"
    },
  },
  etherscan: {
    apiKey: {
      celo: ETHERSCAN_API_KEY,
      celo_sepolia: ETHERSCAN_API_KEY,
    },
  },
  sourcify: {
    enabled: true,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};

export default config;

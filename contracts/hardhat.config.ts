import "@nomicfoundation/hardhat-toolbox";
import { config as loadEnv } from "dotenv";
import type { HardhatUserConfig } from "hardhat/config";

// .env.local takes precedence; .env fills in anything it does not set.
loadEnv({ path: [".env.local", ".env"], quiet: true });

const privateKey = process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      accounts: privateKey && privateKey !== "replace_with_your_deployer_private_key" ? [privateKey] : [],
      chainId: 84532,
    },
  },
};

export default config;

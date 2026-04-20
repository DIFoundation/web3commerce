// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MarketModule = buildModule("MarketModule", (m) => {

  console.log("========== Deploying MarketModule ==========")

  console.log("Deploying Escrow...")
  const escrow = m.contract("Escrow");
  console.log("Escrow deployed at:", escrow)

  console.log("Deploying Marketplace...")
  const marketplace = m.contract("Marketplace", [escrow]);
  console.log("Marketplace deployed at:", marketplace)

  console.log("Setting marketplace on escrow...")
  const setMarketplace = m.call(escrow, "setMarketplace", [marketplace]);
  console.log("Marketplace set on escrow")


  return { escrow, marketplace };
});

export default MarketModule;

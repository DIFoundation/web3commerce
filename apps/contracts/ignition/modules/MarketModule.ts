// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MarketModule = buildModule("MarketModule", (m) => {

  const owner = m.getAccount(0);

  console.log("========== Deploying MarketModule ==========")

  console.log("Deploying Escrow...")
  const escrow = m.contract("Escrow", [], {from: owner});
  console.log("Escrow deployed at:", escrow)

  console.log("Deploying Marketplace...")
  const marketplace = m.contract("Marketplace", [escrow], {from: owner});
  console.log("Marketplace deployed at:", marketplace)

  console.log("Setting marketplace on escrow...")
  const setMarketplace = m.call(escrow, "setMarketplace", [marketplace], {from: owner});
  console.log("Marketplace set on escrow", setMarketplace)


  return { escrow, marketplace };
});

export default MarketModule;

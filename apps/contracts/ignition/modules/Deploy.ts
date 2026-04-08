// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
// import { parseEther } from "viem";
import console from "console";

// const JAN_1ST_2030 = 1893456000;
// const ONE_GWEI: bigint = parseEther("0.001");

const CommerceModule = buildModule("CommerceModule", (m) => {

  console.log("Starting deployment with verification preparation...");

  const escrow = m.contract("Escrow");
  console.log("Escrow deployed at: ", escrow);

  const marketplace = m.contract("Marketplace", [escrow]);
  console.log("Marketplace deployed at: ", marketplace);

  console.log("Linking contracts...");
  m.call(escrow, "setMarketplace", [marketplace]);
  console.log("Contracts linked successfully");

  return { escrow, marketplace };
});

export default CommerceModule;

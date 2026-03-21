// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script, console2} from "forge-std/Script.sol";
import {Escrow} from "../src/Escrow.sol";
import {Marketplace} from "../src/Marketplace.sol";

/**
 * @title Deploy
 * @notice Deployment script for Web3Commerce contracts
 * @dev Deploys Escrow first, then Marketplace with Escrow address, then links them
 */
contract Deploy is Script {
    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory rpcUrl = vm.envString("RPC_URL");

        console2.log("Starting deployment...");
        console2.log("RPC URL: ", rpcUrl);

        vm.startBroadcast(deployerPrivateKey);

        // Step 1: Deploy Escrow contract
        console2.log("Deploying Escrow contract...");
        Escrow escrow = new Escrow();
        console2.log("Escrow deployed at: ", address(escrow));

        // Step 2: Deploy Marketplace contract with Escrow address
        console2.log("Deploying Marketplace contract...");
        Marketplace marketplace = new Marketplace(payable(address(escrow)));
        console2.log("Marketplace deployed at: ", address(marketplace));

        // Step 3: Set Marketplace address in Escrow
        console2.log("Linking contracts...");
        escrow.setMarketplace(address(marketplace));
        console2.log("Marketplace linked to Escrow");

        vm.stopBroadcast();

        // Output deployment summary
        console2.log("\n=== DEPLOYMENT SUMMARY ===");
        console2.log("Network: Celo Sepolia");
        console2.log("Escrow: ", address(escrow));
        console2.log("Marketplace: ", address(marketplace));
        console2.log("========================\n");

        // Output for frontend .env.local
        console2.log("Add these to your frontend .env.local:");
        console2.log(string.concat("NEXT_PUBLIC_ESCROW_ADDRESS=", vm.toString(address(escrow))));
        console2.log(string.concat("NEXT_PUBLIC_MARKETPLACE_ADDRESS=", vm.toString(address(marketplace))));
    }
}

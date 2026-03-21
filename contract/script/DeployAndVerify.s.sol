// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script, console2} from "forge-std/Script.sol";
import {Escrow} from "../src/Escrow.sol";
import {Marketplace} from "../src/Marketplace.sol";

/**
 * @title DeployAndVerify
 * @notice Deployment script with contract verification for Web3Commerce
 * @dev Deploys contracts and prepares for Etherscan/Celoscan verification
 */
contract DeployAndVerify is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory rpcUrl = vm.envString("RPC_URL");

        console2.log("Starting deployment with verification preparation...");
        console2.log("RPC URL: ", rpcUrl);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy Escrow (no constructor args)
        console2.log("Deploying Escrow contract...");
        Escrow escrow = new Escrow();
        address escrowAddress = address(escrow);
        console2.log("Escrow deployed at: ", escrowAddress);

        // Deploy Marketplace with Escrow address
        console2.log("Deploying Marketplace contract...");
        Marketplace marketplace = new Marketplace(payable(escrowAddress));
        address marketplaceAddress = address(marketplace);
        console2.log("Marketplace deployed at: ", marketplaceAddress);

        // Link contracts
        console2.log("Linking contracts...");
        escrow.setMarketplace(marketplaceAddress);
        console2.log("Contracts linked successfully");

        vm.stopBroadcast();

        // Output deployment summary
        console2.log("\n=== DEPLOYMENT SUCCESSFUL ===");
        console2.log("Network: Celo Sepolia");
        console2.log("Escrow: ", escrowAddress);
        console2.log("Marketplace: ", marketplaceAddress);
        console2.log("==============================\n");

        // Output verification commands
        console2.log("Verification commands:");
        console2.log("");
        console2.log("# Verify Escrow (no constructor args):");
        console2.log(string.concat(
            "forge verify-contract ",
            vm.toString(escrowAddress),
            " src/Escrow.sol:Escrow ",
            "--chain-id 44787 ",
            "--etherscan-api-key $ETHERSCAN_API_KEY"
        ));
        console2.log("");
        console2.log("# Verify Marketplace (with Escrow address as constructor arg):");
        console2.log(string.concat(
            "forge verify-contract ",
            vm.toString(marketplaceAddress),
            " src/Marketplace.sol:Marketplace ",
            "--chain-id 44787 ",
            "--etherscan-api-key $ETHERSCAN_API_KEY ",
            "--constructor-args $(cast abi-encode \"constructor(address)\" ",
            vm.toString(escrowAddress),
            ")"
        ));
        console2.log("");

        // Output for frontend .env.local
        console2.log("Add to frontend .env.local:");
        console2.log(string.concat("NEXT_PUBLIC_ESCROW_ADDRESS=", vm.toString(escrowAddress)));
        console2.log(string.concat("NEXT_PUBLIC_MARKETPLACE_ADDRESS=", vm.toString(marketplaceAddress)));
        console2.log(string.concat("NEXT_PUBLIC_RPC_URL=", rpcUrl));
    }
}

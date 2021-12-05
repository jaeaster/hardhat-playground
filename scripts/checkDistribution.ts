import { ethers } from "hardhat";
import { getGasPrice } from "./utils";

const DISTRIBUTOR_ADDRESS = "0x25e4a70ef4639103fa82b7f14cc5ca397d302686";
const DISTRIBUTOR_ABI = [
  "function getUnpaidEarnings(address shareholder) public view returns (uint256)",
  "function claimDividend() external",
];

async function main() {
  const [signer] = await ethers.getSigners();
  const distributorContract = new ethers.Contract(
    DISTRIBUTOR_ADDRESS,
    DISTRIBUTOR_ABI,
    signer
  );
  const earnings = await distributorContract.getUnpaidEarnings(
    await signer.getAddress()
  );

  console.log(`You have ${ethers.utils.formatEther(earnings)} USDC earned`);

  const gasPrice = await getGasPrice(ethers.provider);
  const gasEstimate = await distributorContract.estimateGas.claimDividend();
  console.log(
    "Gas Estimate:",
    ethers.utils.formatEther(gasPrice.mul(gasEstimate))
  );

  const tx = await distributorContract.claimDividend();
  const receipt = await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

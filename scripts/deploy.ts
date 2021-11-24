import { Contract } from "ethers";
import { ethers } from "hardhat";

async function deploy(contractName: string, ...args: any[]): Promise<Contract> {
  const contractFactory = await ethers.getContractFactory(contractName);
  const contract = await contractFactory.deploy(...args);
  const instance = await contract.deployed();
  console.log(`${contractName} deployed to: ${instance.address}`);
  return instance;
}
async function main() {
  const [signer] = await ethers.getSigners();
  // await deploy("HoneyPot");
  const factory = await deploy("JoeFactory", signer.address);
  const router = await deploy("JoeRouter02", factory.address);
  const ponzi = await deploy("GoodPonzi");
  const tx = await signer.sendTransaction({
    to: ponzi.address,
    value: ethers.utils.parseEther("1"),
  });

  console.log("Nonce: ", tx.nonce);
  console.log("Txn: ", `https://testnet.snowtrace.io/tx/${tx.hash}`);
  await tx.wait();

  await ponzi.openTrading(router.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

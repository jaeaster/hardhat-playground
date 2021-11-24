/* eslint-disable node/no-unpublished-import */
import { task } from "hardhat/config";
import { BigNumber } from "ethers";

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("seedphrase", "Creates a new seedphrase", async (taskArgs, hre) => {
  console.log(hre.ethers.Wallet.createRandom().mnemonic);
});

task("send", "Sends balance to other wallet")
  .addPositionalParam("to", "Address to send to")
  .addOptionalPositionalParam("amount", "Amount to send")
  .setAction(async (taskArgs, hre) => {
    const { to, amount } = taskArgs;
    const [signer] = await hre.ethers.getSigners();
    let value = await signer.getBalance();

    if (amount) {
      value = BigNumber.from(hre.ethers.utils.parseEther(amount));
    }

    const gas = await signer.estimateGas({ to, value });
    const gasPrice = await signer.getGasPrice();
    value = value.sub(gasPrice.mul(gas));

    const tx = await signer.sendTransaction({
      to,
      value,
    });

    console.log("Nonce: ", tx.nonce);
    console.log("Txn: ", `https://testnet.snowtrace.io/tx/${tx.hash}`);
    await tx.wait();
  });

import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { LPFortBondDepository } from "../typechain";

const lpFortBondDepositoryAddress =
  "0x57295798BeF860832f3546E1dAD66554d7F590C1";

const getGasPrice = async (provider: JsonRpcProvider) => {
  const GAS = "5";
  const gasPrice = await provider.getGasPrice();
  const convertGas = ethers.utils.parseUnits(GAS, "gwei");
  return gasPrice.add(convertGas);
};

const logBondPrice = async (
  bondingContract: LPFortBondDepository,
  address: string
) => {
  const bondInfo = await bondingContract.bondInfo(address);
  console.log(
    "Payout:",
    ethers.utils.formatUnits(bondInfo.payout, "gwei"),
    "FORT"
  );
  console.log(
    "Price Paid:",
    ethers.utils.formatEther(bondInfo.pricePaid),
    "MIM"
  );
  console.log("Last time:", new Date(bondInfo.lastTime * 1000));
  console.log("Vesting:", bondInfo.vesting / 3600 / 24, "days");
};

const claimAndStake = async (
  bondingContract: LPFortBondDepository,
  address: string
) => {
  const gasPrice = await getGasPrice(ethers.provider);
  const gasEstimate = await bondingContract.estimateGas.redeem(address, true);
  console.log(
    "Gas Estimate:",
    ethers.utils.formatEther(gasPrice.mul(gasEstimate))
  );
  const redeemTx = await bondingContract.redeem(address, true, { gasPrice });
  console.log("Nonce: ", redeemTx.nonce);
  console.log("Txn: ", `https://snowtrace.io/tx/${redeemTx.hash}`);

  const redeemReceipt = await redeemTx.wait();
  console.log(
    "Gas Paid: ",
    ethers.utils.formatEther(
      redeemReceipt.gasUsed.mul(redeemReceipt.effectiveGasPrice)
    )
  );
};

const isTime = (): Boolean => {
  const now = new Date(Date.now());
  const rebaseHours = [2, 10, 18];
  const rebaseMinutes = 50;
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  console.log(`Current time is ${currentHour}:${currentMinutes}`);
  if (rebaseHours.map((hour) => hour - 1).includes(currentHour)) {
    if (currentMinutes > rebaseMinutes) {
      return true;
    }
  }
  return false;
};

const logNextRebase = () => {
  const now = new Date(Date.now());
  const rebaseHours = [2, 10, 18];
  const currentHour = now.getHours();
  const nextRebases = rebaseHours.filter((hour) => hour > currentHour);
  const nextRebase = nextRebases.length === 0 ? rebaseHours[0] : nextRebases[0];
  console.log(`Next rebase is at ${nextRebase}:00`);
};

async function main() {
  const [signer] = await ethers.getSigners();
  const BondingContract = await ethers.getContractFactory(
    "LPFortBondDepository"
  );
  const bondingContract = await BondingContract.attach(
    lpFortBondDepositoryAddress
  );

  while (true) {
    if (!isTime()) {
      console.log("Not time yet");
      logNextRebase();
      console.log("Sleeping for 5 minutes...\n");
      await new Promise((resolve) => setTimeout(resolve, 1000 * 60 * 5));
      continue;
    }
    console.log("AHHHH IM REBASIINNNGG");
    const gasPrice = await getGasPrice(ethers.provider);
    console.log(
      "Gas price:",
      ethers.utils.formatUnits(gasPrice, "gwei"),
      "gwei"
    );

    await logBondPrice(bondingContract, signer.address);
    await claimAndStake(bondingContract, signer.address);
    console.log("Sleeping 8 hours until next rebase...");
    await new Promise((resolve) => setTimeout(resolve, 1000 * 60 * 60 * 8));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

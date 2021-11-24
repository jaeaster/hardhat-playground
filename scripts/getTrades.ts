import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { JoePair, PangolinPair } from "../typechain";

const ROCO_WAVAX_ADDRESS = "0x8C28394Ed230cD6cAF0DAA0E51680fD57826DEE3";
const RACEX_WAVAX_ADDRESS = "0xb57c80a860e510e15D4ce01af944E65ccF9cD673";

// const TRADER_JOE_ROUTER_ADDRESS = "0x60ae616a2155ee3d9a68541ba4544862310933d4";

const pangolinLPs = [RACEX_WAVAX_ADDRESS];
const joeLPs = [ROCO_WAVAX_ADDRESS];

async function main() {
  // const [signer] = await ethers.getSigners();

  const JoePair = await ethers.getContractFactory("JoePair");
  const joePair: JoePair = await JoePair.attach(ROCO_WAVAX_ADDRESS);

  const PangolinPair = await ethers.getContractFactory("JoePair");
  const pangolinPair: PangolinPair = await PangolinPair.attach(
    RACEX_WAVAX_ADDRESS
  );

  // joePair.queryFilter()
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

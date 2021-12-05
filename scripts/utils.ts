import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "hardhat";

export const getGasPrice = async (provider: JsonRpcProvider) => {
  const GAS = "5";
  const gasPrice = await provider.getGasPrice();
  const convertGas = ethers.utils.parseUnits(GAS, "gwei");
  return gasPrice.add(convertGas);
};

import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "hardhat";

export const getGasPrice = async (provider: JsonRpcProvider) => {
  const GAS = "5";
  const gasPrice = await provider.getGasPrice();
  const convertGas = ethers.utils.parseUnits(GAS, "gwei");
  return gasPrice.add(convertGas);
};

export const JOE_ROUTER_ADDRESS = "0x60aE616a2155Ee3d9A68541Ba4544862310933d4";
export const WAVAX_ADDRESS = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
export const MIM_ADDRESS = "0x130966628846BFd36ff31a822705796e8cb8C18D";
export const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

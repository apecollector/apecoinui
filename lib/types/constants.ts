import { Map } from "@/types/map";
import { StakingContractAddress } from "@/types/data";

export const stakingContractAddresses: Map = {
  1: "0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9",
  5: StakingContractAddress.Goerli,
} as const;

export const apecoinContractAddresses: Map = {
  1: "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
  5: "0x328507DC29C95c170B56a1b3A758eB7a9E73455c",
} as const;

export const MAX_STAKES = {
  1: 10094,
  2: 2042,
  3: 856,
} as const;

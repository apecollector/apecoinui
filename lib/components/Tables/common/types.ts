import { BigNumber, ethers } from "ethers";
import { PoolType } from "../../../types/constants";
import { SingleNft, PairNftWithAmount, PairNft } from "../../../types/contract";

export type IWithdrawArgsApecoin = (asString: boolean) => string | BigNumber;

export type IWithdrawArgsNft = (
  poolId: PoolType.MAYC | PoolType.BAYC,
  asString: boolean
) => (SingleNft | (string | number)[])[];

export type IWithdrawArgsBakc = (
  mainTypePoolId: PoolType.MAYC | PoolType.BAYC,
  asString: boolean
) => ((string | number)[] | PairNftWithAmount)[];

export type IClaimArgsApecoin = (asString: boolean) => string | BigNumber;

export type IClaimArgsNft = (
  poolId: PoolType.MAYC | PoolType.BAYC,
  asString: boolean
) => (number | BigNumber)[];

export type IClaimArgsBakc = (
  mainTypePoolId: number,
  asString: boolean
) => (PairNft | number[])[];

export type IClaimArgs = (
  poolId: number,
  asString: boolean
) => string | BigNumber | (number | undefined)[] | undefined;

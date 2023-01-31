import { BigNumber } from "ethers";
import { PoolType } from "./constants";

export interface SingleNft {
  tokenId: number;
  amount: BigNumber;
}

export interface SingleNftDeposit {
  tokenId: BigNumber;
  amount: BigNumber;
}

export interface PairNft {
  mainTokenId: number;
  bakcTokenId: number;
}

export type PairNftWithAmount = {
  mainTokenId: number;
  bakcTokenId: number;
  amount: BigNumber;
  isUncommit: boolean;
};

export type PairNftClaim = {
  mainTokenId: BigNumber;
  bakcTokenId: BigNumber;
};

export type PoolData = {
  [key in PoolType]: {
    name: string;
    stakedAmount?: number;
    rewardPoolPerHour?: number;
    rewardPoolPerDay?: number;
    rewardPerHour?: number;
    rewardPerDay?: number;
    apr?: number;
  };
};

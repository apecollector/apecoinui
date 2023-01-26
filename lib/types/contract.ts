import { BigNumber } from "ethers";
import { PoolType } from "./constants";

export interface SingleNft {
  tokenId: BigNumber;
  amount: BigNumber;
}

export interface PairNft {
  mainTokenId: BigNumber;
  bakcTokenId: BigNumber;
}

export type PairNftWithAmount = PairNft & {
  amount: BigNumber;
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

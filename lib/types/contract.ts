import { BigNumber } from "ethers";

export interface SingleNft {
  tokenId: BigNumber;
  amount: BigNumber;
}

export interface PairNftWithAmount {
  mainTokenId: BigNumber;
  bakcTokenId: BigNumber;
  amount: BigNumber;
}

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

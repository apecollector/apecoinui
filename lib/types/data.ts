export enum PoolType {
  APE = 0,
  BAYC = 1,
  MAYC = 2,
  BAKC = 3,
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

export enum Amount {
  PerApe = "PerApe",
  Max = "Max",
}

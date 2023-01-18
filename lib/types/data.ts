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

export enum StakingContractAddress {
  Goerli = "0x831e0c7A89Dbc52a1911b78ebf4ab905354C96Ce",
  Ethereum = "0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9",
}

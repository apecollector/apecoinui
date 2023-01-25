import { Map } from "@/types/map";

enum Network {
  Ethereum = 1,
  Goerli = 5,
}

export enum ApecoinContractAddress {
  Ethereum = "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
  Goerli = "0x328507DC29C95c170B56a1b3A758eB7a9E73455c",
}

export enum StakingContractAddress {
  Ethereum = "0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9",
  Goerli = "0x831e0c7A89Dbc52a1911b78ebf4ab905354C96Ce",
}

export const ApecoinContractAddresses: Map = {
  [Network.Ethereum]: "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
  [Network.Goerli]: "0x328507DC29C95c170B56a1b3A758eB7a9E73455c",
} as const;

export const BaycContractAddresses: Map = {
  [Network.Ethereum]: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
  [Network.Goerli]: "0x9c4536F82bdDe595cF1F810309feE8a288aef89E",
} as const;

export const MaycContractAddresses: Map = {
  [Network.Ethereum]: "0x60e4d786628fea6478f785a6d7e704777c86a7c6",
  [Network.Goerli]: "0x67d4266A52870879727EfFb903CE0030Fe86D6AC",
} as const;

export const BakcContractAddresses: Map = {
  [Network.Ethereum]: "0xba30e5f9bb24caa003e9f2f0497ad287fdf95623",
  [Network.Goerli]: "0xC84dE322c8403f8d8E2bAA3cB384A1e281664cF6",
} as const;

export const StakingContractAddresses: Map = {
  [Network.Ethereum]: StakingContractAddress.Ethereum,
  [Network.Goerli]: StakingContractAddress.Goerli,
};

export const MAX_STAKES = {
  1: 10094,
  2: 2042,
  3: 856,
} as const;

export enum PoolType {
  APE = 0,
  BAYC = 1,
  MAYC = 2,
  BAKC = 3,
}

export enum Amount {
  PerApe = "PerApe",
  Max = "Max",
}

import { ethers } from "ethers";

export type IWithdrawArgs = (
  poolID: number,
  asString: boolean
) =>
  | (string | ethers.BigNumber)[]
  | (
      | (string | number)[]
      | {
          tokenId: ethers.BigNumber;
          amount: ethers.BigNumber;
        }[]
      | undefined
    )[]
  | undefined;

export type IWithdrawArgsBakc = (
  mainTypePoolId: number,
  asString: boolean
) =>
  | (
      | (string | number)[]
      | {
          mainTokenId: ethers.BigNumber;
          bakcTokenId: ethers.BigNumber;
          amount: ethers.BigNumber;
          isUncommit: boolean;
        }[]
      | undefined
    )[]
  | undefined;
export type IClaimArgs = (
  poolID: number,
  asString: boolean
) =>
  | (string | ethers.BigNumber)[]
  | (
      | (string | number)[]
      | { tokenId: ethers.BigNumber; amount: ethers.BigNumber }[]
      | undefined
    )[]
  | undefined;

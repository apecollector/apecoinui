import { BigNumber, ethers } from "ethers";

export type IWithdrawArgs = (
  poolID: number,
  asString: boolean
) =>
  | string
  | BigNumber
  | (
      | (string | number)[]
      | {
          tokenId: BigNumber;
          amount: BigNumber;
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
          mainTokenId: BigNumber;
          bakcTokenId: BigNumber;
          amount: BigNumber;
          isUncommit: boolean;
        }[]
      | undefined
    )[]
  | undefined;

export type IClaimArgsBakc = (
  mainTypePoolId: number,
  asString: boolean
) =>
  | (
      | (string | number)[]
      | {
          mainTokenId: BigNumber;
          tokenId: BigNumber;
          amount: BigNumber;
        }[]
      | undefined
    )[]
  | undefined;

export type IClaimArgs = (
  poolID: number,
  asString: boolean
) => string | BigNumber | (number | undefined)[] | undefined;

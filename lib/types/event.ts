import { BigNumber } from "ethers";

export interface EventData {
  type: string;
  user: string;
  amount: BigNumber;
  poolId: number;
  hash: string;
}

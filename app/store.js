import create from "zustand";
import produce from "immer";
import { mountStoreDevtool } from "simple-zustand-devtools";

const useStakingStore = create((set) => ({
  autoConnecting: true,
  setAutoConnecting: (connecting) => set({ autoConnecting: connecting }),

  apeCoinBalance: 0,
  setApeCoinBalance: (balance) => set({ apeCoinBalance: balance }),

  apeCoinAllowance: 0,
  setApeCoinAllowance: (allowance) => set({ apeCoinAllowance: allowance }),

  stakedApeCoinCount: 0,
  setStakedApeCoinCount: (count) =>
    set((state) => ({ stakedApeCoinCount: state.stakedApeCoinCount + count })),

  apePoolTokens: [],
  baycPoolTokens: [],
  maycPoolTokens: [],
  bakcPoolTokens: [],

  setApePoolTokens: (tokens) => set((state) => ({ ...state, apePoolTokens: tokens })),
  updateApePoolToken: (update) =>
    set(
      produce((draft) => {
        const token = draft.apePoolTokens.find((token) => token.tokenID === update.tokenID);
        token.amountToStake = update.amountToStake;
      })
    ),

  setBaycPoolTokens: (tokens) => set((state) => ({ ...state, baycPoolTokens: tokens })),
  updateBaycPoolToken: (update) =>
    set(
      produce((draft) => {
        const token = draft.baycPoolTokens.find((token) => token.tokenID === update.tokenID);
        token.amountToStake = update.amountToStake;
      })
    ),

  setMaycPoolTokens: (tokens) => set((state) => ({ ...state, maycPoolTokens: tokens })),
  updateMaycPoolToken: (update) =>
    set(
      produce((draft) => {
        const token = draft.maycPoolTokens.find((token) => token.tokenID === update.tokenID);
        token.amountToStake = update.amountToStake;
      })
    ),

  setBakcPoolTokens: (tokens) => set((state) => ({ ...state, bakcPoolTokens: tokens })),
  updateBakcPoolToken: (update) =>
    set(
      produce((draft) => {
        const token = draft.bakcPoolTokens.find((token) => token.tokenID === update.tokenID);
        token.amountToStake = update.amountToStake;
      })
    ),
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", useStakingStore);
}

export default useStakingStore;

import { useCallback, useEffect, useMemo } from "react";
import { fetchCoinList } from "../api";
import { create } from "zustand";

interface Market {
  coinCode: string;
  englishName: string;
  koreanName: string;
  rsi: string;
}

// zustand 스토어
interface CoinListStore {
  markets: Market[];
  coin: string;
  setCoin: (coinName: string) => void;
  fetchCoinList: () => Promise<void>;
}

const useCoinListStore = create<CoinListStore>((set) => ({
  markets: [],
  coin: "BTC",
  fetchCoinList: async () => {
    try {
      const data = await fetchCoinList();
      set({ markets: data });
    } catch (error) {
      console.error("코인 리스트 에러:", error);
    }
  },
  setCoin: (coinName) => set({ coin: coinName }),
}));

export const useCoinList = () => {
  const { markets, fetchCoinList, setCoin } = useCoinListStore();

  useEffect(() => {
    fetchCoinList();
  }, []);

  const memoizedMarkets = useMemo(() => markets, [markets]);
  const memoizedSetCoin = useCallback(setCoin, [setCoin]);

  return {
    markets: memoizedMarkets,
    setCoin: memoizedSetCoin,
  };
};

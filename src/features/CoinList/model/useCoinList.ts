import { create } from "zustand";
import { fetchCoin } from "../api";
import { useEffect, useRef } from "react";

interface Market {
  coinCode: string;
  englishName: string;
  koreanName: string;
  rsi: string;
  like?: boolean;
}

// zustand store 인터페이스
interface CoinListStore {
  markets: Market[];
  loading: boolean;
  sortList: string;
  marketsCache: Record<string, Market[]>;
  fetchCoinList: (sortList: string) => Promise<void>;
  setSortList: (coinState: string) => void;
}

const useCoinListStore = create<CoinListStore>((set, get) => ({
  markets: [],
  loading: false,
  sortList: "", // 정렬 기본값 좋아요 순
  marketsCache: {},

  fetchCoinList: async (sortList: string) => {
    const { marketsCache, loading } = get();
    if (loading) return; // 이미 로딩 중이면 중복 호출 방지

    if (marketsCache[sortList]) {
      set({ markets: marketsCache[sortList] }); // 기존 상태와 다를 때만 set

      return;
    }
    set({ loading: true }); //로딩 true로 중복호출 방지
    try {
      const data = await fetchCoin(sortList);
      const formattedMarkets = data.map((market: { rsi: string }) => ({
        ...market,
        rsi: !isNaN(Number(market.rsi))
          ? parseFloat(market.rsi).toFixed(1)
          : market.rsi,
      }));
      set((state) => ({
        markets: formattedMarkets,
        marketsCache: { ...state.marketsCache, [sortList]: formattedMarkets }, // 기존 marketsCache를 유지하면서, 현재 sortList에 대한 데이터만 추가.
        loading: false,
      })); //(state):기존 상태 참조&새 상태 만듬
    } catch (error) {
      set({ loading: false });
      console.error("코인 리스트 에러:", error);
    }
  },
  setSortList: (sortList: string) => {
    if (sortList !== get().sortList) {
      set({ sortList }); //  새로 들어온 sortList와 현재 스토어의 get().sortList가 다를때만 변경
    }
  },
}));

export default function useCoinList() {
  const { markets, fetchCoinList, setSortList, sortList } = useCoinListStore();
  const prevSortList = useRef(sortList); // sortList의 이전 값을 저장
  const isInitialLoad = !useCoinListStore.getState().markets.length; //sidbar 렌더링 시 재호출 방지
  useEffect(() => {
    if (prevSortList.current !== sortList || isInitialLoad) {
      console.log(
        "sortList변경:",
        useCoinListStore.getState().sortList,
        sortList,
        "기존값:",
        prevSortList.current
      );
      fetchCoinList(sortList);
      prevSortList.current = sortList;
    }
  }, [sortList]);
  return { markets, setSortList, sortList };
}

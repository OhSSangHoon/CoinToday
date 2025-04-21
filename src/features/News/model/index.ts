import { create } from "zustand";
import { fetchNews, fetchCoinList } from "../api";
import { useEffect, useState } from "react";

// 뉴스 아이템 인터페이스
export interface NewsItem {
  title: string;
  url: string;
  image: string;
  content: string;
  newspaper: string;
  time: string;
}

// 코인 인터페이스
export interface Coin {
  coinCode: string;
  englishName: string;
  koreanName: string;
}

// 뉴스 스토어 인터페이스
interface NewsStore {
  news: NewsItem[];
  coin: string;
  fetchNews: (coinName?: string) => Promise<void>;
  setCoin: (coinName: string) => void;
}

// 뉴스 데이터 저장
export const useNewsStore = create<NewsStore>((set) => ({
  news: [],
  coin: "BTC",
  fetchNews: async (coinName = "BTC") => {
    const data = await fetchNews(coinName);
    set({ news: data, coin: coinName });
  },
  setCoin: (coinName) => set({ coin: coinName }),
}));

// 뉴스 페이지 훅
export function useNewsPage() {
  // 브라우저 환경 확인
  const isBrowser = typeof window !== 'undefined';
  
  // 초기 코인 설정
  const getInitialCoin = () => {
    if(isBrowser) {
      const params = new URLSearchParams(window.location.search);
      const coinParam = params.get("coin");
      return coinParam || "BTC";
    }
    return "BTC";
  };

  // 뉴스 스토어에서 데이터 가져오기
  const { news, fetchNews, setCoin: setStoreCoin } = useNewsStore();
  
  // 초기 코인 설정
  const [coin, setCoinState] = useState<string>(getInitialCoin());
  
  // 뉴스 순서 변경
  const [order, setOrder] = useState<NewsItem[]>([]);
  
  // 코인 목록 가져오기
  const [coinList, setCoinList] = useState<Coin[]>([]);
  
  // 드롭다운 열림 여부
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 코인 선택 함수
  const setCoin = (coinName: string) => {
    setCoinState(coinName);
    setStoreCoin(coinName);

    if(isBrowser) {
      const url = new URL(window.location.href);
      url.searchParams.set("coin", coinName);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // 뉴스 순서 변경
  const handleOrder = (index: number) => {
    if (index === 0) return;

    const newOrder = [...order];
    [newOrder[0], newOrder[index]] = [newOrder[index], newOrder[0]];
    setOrder(newOrder);
  };

  // 드롭다운 코인 목록 텍스트 가져오기
  const getDropdownCoinList = () => {
    if(["BTC", "ETH", "XRP"].includes(coin)) {
      return '기타 코인';
    }
    return coinList.find(c => c.coinCode === coin)?.koreanName || '기타 코인';
  };

  // 코인 변경 시 뉴스 데이터 가져오기
  useEffect(() => {
    fetchNews(coin);
  }, [coin, fetchNews]);

  // 뉴스 데이터 정렬
  useEffect(() => {
    if(news.length > 0) {
      setOrder(news);
    }
  }, [news]);

  // 코인 목록 가져오기
  useEffect(() => {
    const loadCoinList = async () => {
      const data = await fetchCoinList("BTC");
      setCoinList(data);
    };
    loadCoinList();
  }, []);

  return {
    news,
    order,
    coin,
    coinList,
    isDropdownOpen,
    setIsDropdownOpen,
    setCoin,
    handleOrder,
    getDropdownCoinList
  };
}
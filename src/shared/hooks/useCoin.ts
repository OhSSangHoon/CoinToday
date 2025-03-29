import { useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// URL에서 코인 정보를 읽는 함수 (스토어 외부에 정의)
function getInitialCoinFromURL() {
  const pathname = window.location.pathname;
  const urlParts = pathname.split('/');
  
  if (urlParts.length >= 3 && urlParts[1] === "exchange") {
    return urlParts[2].toUpperCase();
  }
  return "BTC"; // 기본값
}

// zustand 스토어 인터페이스
interface CoinListStore {
  coin: string;
  setCoin: (coinName: string) => void;
  initialized: boolean;
  setInitialized: (value: boolean) => void;
}

// URL에서 초기 코인 값 가져오기
const initialCoin = getInitialCoinFromURL();
console.log("URL에서 감지된 초기 코인:", initialCoin);

const useCoinStore = create<CoinListStore>()(
  persist(
    (set) => ({
      coin: initialCoin, // URL에서 가져온 값으로 초기화
      setCoin: (coinName) => set({ coin: coinName }),
      initialized: false,
      setInitialized: (value) => set({ initialized: value }),
    }),
    {
      name: "coin-storage",
    }
  )
);

export default function useCoin() {
  const { coin, setCoin, initialized, setInitialized } = useCoinStore();
  const navigate = useNavigate();
  const location = useLocation();

  // 페이지 로드/새로고침 시 URL에서 코인 정보 확인 및 동기화
  useEffect(() => {
    if (!initialized) {
      const urlCoin = getInitialCoinFromURL();
      console.log("초기화 중 - URL 코인:", urlCoin, "스토어 코인:", coin);
      
      if (urlCoin !== coin) {
        console.log(`코인 초기화: ${coin} -> ${urlCoin}`);
        setCoin(urlCoin);
      }
      
      setInitialized(true);
    }
  }, [initialized, coin, setCoin, setInitialized]);

  // URL 변경을 감지하여 코인 정보 업데이트
  useEffect(() => {
    if (initialized) {
      const pathname = location.pathname;
      const urlParts = pathname.split('/');
      
      if (urlParts.length >= 3 && urlParts[1] === "exchange") {
        const urlCoin = urlParts[2].toUpperCase();
        
        if (urlCoin && urlCoin !== coin) {
          console.log(`URL 변경 감지 - 코인 업데이트: ${coin} -> ${urlCoin}`);
          setCoin(urlCoin);
        }
      }
    }
  }, [location.pathname, coin, setCoin, initialized]);

  const handleSelectMarket = useCallback(
    (coinCode: string) => {
      console.log(`코인 선택: ${coinCode} (이전: ${coin})`);
      setCoin(coinCode);
      navigate(`/exchange/${coinCode}`);
    },
    [setCoin, navigate, coin]
  );

  return { coin, handleSelectMarket, setCoin };
}

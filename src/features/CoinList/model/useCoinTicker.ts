import { useQuery } from "@tanstack/react-query";
import { fetchTickerData } from "../api";
import useCoinList from "./useCoinList";
import { useMemo } from "react";

interface Ticker {
  coinCode: string;
  price: string;
  changeRate: number;
  tradeVolume: string;
}

export default function useCoinTicker() {
  const { markets } = useCoinList();

  // useQuery를 사용하여 ticker 데이터를 패칭하고, 6초초마다 자동으로 새로 받아오도록 설정
  const { data: tickerData, isLoading } = useQuery({
    queryKey: ["tickerData"],
    queryFn: fetchTickerData,
    refetchInterval: 3000,
    staleTime: 3000, // 3초 동안 캐시된 데이터 사용
    gcTime: 300000, // 5분동안 캐시 유지
    enabled: markets.length > 0,
  });

  // 데이터가 로드되면 tickerData를 markets 배열의 순서대로 정렬, tickerData가 변경될 때만 tickerList를 재계산
  const tickerList = useMemo(() => {
    if (!tickerData) {
      console.log("ticker 데이터 없음");
      return [];
    }
    const tickerDataByCode = tickerData.data;
    console.log("hook-ticker재정렬 UI-맵 재생성");
    return markets
      .map(({ coinCode }) => {
        const ticker = tickerDataByCode[coinCode];
        return ticker
          ? {
              coinCode,
              price: ticker.closing_price,
              changeRate: parseFloat(ticker.fluctate_rate_24H),
              tradeVolume: (ticker.acc_trade_value_24H / 1_000_000).toFixed(2),
            }
          : null;
      })
      .filter((item): item is Ticker => item !== null);
  }, [tickerData]);

  if (isLoading) {
    return { tickerList: [], isLoading };
  }

  return { tickerList, isLoading };
}

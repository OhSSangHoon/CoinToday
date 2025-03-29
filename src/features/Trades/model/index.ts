import { useEffect, useMemo, useState } from "react";
import { tradeApi } from "../api";
import { useWebsocket, useCoin } from "../../../shared";

// HTTP API로부터 받는 거래 데이터 타입
interface TradeData {
  transaction_date: string;
  price: string;
  units_traded: string;
  total: string;
  type: string;
}

// 웹소켓에서 받는 거래 데이터 타입
interface WebsocketTradeData {
  symbol: string;
  buySellGb: "1" | "2"; // 1: 매도, 2: 매수
  contPrice: string;
  contQty: string;
  contAmt: string;
  contDtm: string;
  updn: "up" | "dn";
}

export const useTradeData = () => {
  const { coin: selectedMarket } = useCoin();
  const { isConnected, tradeData: wsTradeData, sendMessage } = useWebsocket();
  const [httpTradeData, setHttpTradeData] = useState<TradeData[]>([]);

  useEffect(() => {
    if (selectedMarket) {
      const fetchTradeData = async () => {
        const response = await tradeApi(selectedMarket);
        setHttpTradeData(response.slice(0, 50).reverse());
      };
      fetchTradeData();
    }
  }, [selectedMarket]);

  useEffect(() => {
    if (isConnected && selectedMarket) {
      sendMessage({ type: "transaction", symbols: [`${selectedMarket}_KRW`] });
    }
  }, [isConnected, selectedMarket, sendMessage]);

  // useWebsocket에서 trade가 변할 때마다 계산
  const mergedData = useMemo(() => {
    // 타입 단언을 사용하여 웹소켓 데이터를 명시적으로 WebsocketTradeData 배열로 지정
    const wsData = wsTradeData as WebsocketTradeData[];
    
    // 웹소켓 데이터를 TradeData 형식으로 변환
    const convertedTrades: TradeData[] = wsData
      .map((t: WebsocketTradeData) => ({
        transaction_date: t.contDtm,
        price: t.contPrice,
        units_traded: t.contQty,
        total: t.contAmt,
        type: t.buySellGb === "1" ? "ask" : "bid",
      }))
      .slice(0, 50)
      .reverse();

    return [...convertedTrades, ...httpTradeData].slice(0, 50);
  }, [wsTradeData, httpTradeData, selectedMarket]);

  return { tradeData: mergedData };
};
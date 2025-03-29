//trade, orderbook 웹소캣용 커스텀 훅

import { useCallback, useEffect, useRef, useState } from "react";
import useCoin from "./useCoin";

const Socket_URL = "wss://pubwss.bithumb.com/pub/ws";

type TradeData = {
  symbol: string;
  buySellGb: "1" | "2"; // 1: 매도, 2: 매수
  contPrice: string;
  contQty: string;
  contAmt: string;
  contDtm: string;
  updn: "up" | "dn";
};

type OrderbookData = {
  symbol: string;
  datetime: string;
  asks: [string, string][]; // [가격, 잔량]
  bids: [string, string][];
};

export default function useWebsocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const tradeBuffer = useRef<TradeData[]>([]);
  const orderbookBuffer = useRef<OrderbookData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tradeData, setTradeData] = useState<TradeData[]>([]);
  const [orderbookData, setOrderbookData] = useState<OrderbookData>();

  const { coin: selectedMarket } = useCoin();
  
  const prevCoinRef = useRef<string | null>(null);

  const sendMessage = useCallback(
    (message: object) => {
      if (wsRef.current && isConnected) {
        wsRef.current.send(JSON.stringify(message));
      }
    },
    [isConnected]
  );

  const connectWebsocket = useCallback(() => {
    if (wsRef.current) return; //이미 연결 중일 경우 중복연결 방지

    wsRef.current = new WebSocket(Socket_URL);

    wsRef.current.onopen = () => {
      console.log("웹소켓 연결 성공");
      setIsConnected(true);
      console.log("연결상태", isConnected);
    };

    // 들어오는 웹소캣 데이터들은 실시간으로 버퍼에 저장
    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "transaction") {
        tradeBuffer.current = [
          ...tradeBuffer.current,
          ...message.content.list,
        ].slice(-50);
      } else if (message.type === "orderbooksnapshot") {
        orderbookBuffer.current = message.content;
      }
    };

    wsRef.current.onclose = (event) => {
      console.log(
        "웹소캣 연결 끊김.재연결 시도, 코드:",
        event.code,
        "이유:",
        event.reason
      );
      setIsConnected(false);
      wsRef.current = null;
      connectWebsocket();
    };
  }, []); // 빈 배열로 유지하여 함수가 재생성되지 않도록 함

  useEffect(() => {
    connectWebsocket();

    // 1초마다 화면에 데이터 업뎃
    const interval = setInterval(() => {
      setTradeData([...tradeBuffer.current]);
      if (orderbookBuffer.current) {
        setOrderbookData(orderbookBuffer.current);
      }
    }, 1000);

    return () => {
      if (wsRef.current) {
        wsRef.current.close(); // 직접 웹소캣을 닫는 메서드,웹소캣 열려 있으면 닫은 후 onclose 실행
      }
      clearInterval(interval);
    }; // 클린업 함수 - 언마운트시 실행
  }, []); //마운트시 실행

  useEffect(() => {
    // 코인이 변경되면 웹소캣 연결 초기화
    if (prevCoinRef.current !== selectedMarket) {
      prevCoinRef.current = selectedMarket;
      
      // 웹소캣 연결 초기화
      tradeBuffer.current = [];
      orderbookBuffer.current = null;
      setTradeData([]);
      setOrderbookData(undefined);

      if (isConnected && selectedMarket) {
        sendMessage({
          type: "orderbooksnapshot",
          symbol: [`${selectedMarket}_KRW`]
        });

        sendMessage({
          type: "transaction",
          symbol: [`${selectedMarket}_KRW`]
        });
      }
    }
  }, [selectedMarket, isConnected, sendMessage]);

  return {
    isConnected,
    sendMessage,
    tradeData,
    orderbookData,
  };
}

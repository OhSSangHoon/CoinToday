import axios from "axios";

// 코인 현재가 가져오기
export const fetchCoinPrice = async (coinCode: string) => {
  try {
    const response = await axios.get(
      `https://api.bithumb.com/public/ticker/${coinCode}_KRW`
    );
    console.log(`${coinCode} 현재가 로드 성공:`, response.data);
    return response.data.data;
  } catch (error) {
    console.error(`${coinCode} 현재가 로드 에러:`, error);
    return null;
  }
};

// API 호출 부분 디버깅 로그 추가
export const submitLimitOrder = async (
  userId: string,
  coinName: string,
  coinPrice: string,
  cash: string,
  state: "bid" | "ask" = "bid"
): Promise<boolean> => {
  try {
    console.log(`지정가 주문 요청 payload:`, {
      userId,
      coinName,
      coinPrice,
      cash,
      state
    });
    
    const response = await axios.post(
      "http://116.126.197.110:30010/limit-order",
      {
        userId,
        coinName,
        coinPrice,
        cash,
        state
      }
    );
    
    console.log("지정가 주문 응답:", response.data, response.status);
    return response.status === 200;
  } catch (error) {
    console.error("지정가 주문 실패:", error);
    return false;
  }
};

// 시장가 매수 API
export const submitMarketBuyOrder = async (
  userId: string,
  coinName: string,
  cash: string
): Promise<boolean> => {
  try {
    console.log(`시장가 매수 요청: ${coinName}, ${cash}원`);
    
    const response = await axios.post(
      "http://116.126.197.110:30010/buy-coin",
      {
        userId,
        coinName,
        cash
      }
    );
    
    console.log("시장가 매수 주문 성공:", response.data);
    return response.status === 200;
  } catch (error) {
    console.error("시장가 매수 주문 실패:", error);
    return false;
  }
};
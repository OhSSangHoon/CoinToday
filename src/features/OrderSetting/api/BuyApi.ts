import axios from "axios";

// axios 기본 설정
const apiClient = axios.create({
  baseURL: "http://116.126.197.110:30010",
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json'
  }
});

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

// 지정가 주문 API
export const submitLimitOrder = async (
  userId: string,
  coinName: string,
  coinPrice: string,
  cash: string,
  state: "bid" | "ask"
): Promise<boolean> => {
  try {
    console.log(`지정가 주문 요청 payload:`, {
      userId,
      coinName,
      coinPrice,
      cash,
      state
    });
    
    const response = await apiClient.post(
      "/limit-order",
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
    throw error; // 에러를 상위로 전파하도록 변경
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
    
    const response = await apiClient.post(
      "/buy-coin",
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
    throw error; // 에러를 상위로 전파하도록 변경
  }
};

// RSI 주문 API
export const submitMarketTAOrder = async (
  userId: string,
  coinName: string,
  cash: string,
  rsi: string,
  state: "bid" | "ask",
  intervals: string
): Promise<boolean> => {
  try {
    // 입력값 검증
    if (!userId || !coinName || !cash || !rsi || !state || !intervals) {
      throw new Error("필수 매개변수가 누락되었습니다");
    }
    
    console.log(`RSI 주문 요청: ${coinName}, ${cash}원, ${rsi}%, ${state}, ${intervals}`);
    
    const response = await apiClient.post(
      "/auto-trade",
      {
        userId,
        coinName,
        cash,
        rsi,
        state,
        intervals
      }
    );
    
    console.log("RSI 주문 성공:", response.data);
    return response.status === 200;
  } catch (error) {
    console.error("RSI 주문 실패:", error);
    throw error; // 에러를 상위로 전파하도록 변경
  }
};

// RSI 주문 취소 API
export const cancelRSIOrder = async (
  userId: string
): Promise<boolean> => {
  try {
    if (!userId) {
      throw new Error("사용자 ID가 필요합니다");
    }
    
    console.log(`RSI 주문 취소 요청: ${userId}`);
    
    const response = await apiClient.post(
      "/stop-auto-trade",
      {
        userId
      }
    );
    
    console.log("RSI 주문 취소 성공:", response.data);
    return response.status === 200;
  } catch (error) {
    console.error("RSI 주문 취소 실패:", error);
    throw error; // 에러를 상위로 전파하도록 변경
  }
};
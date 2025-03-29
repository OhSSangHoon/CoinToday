import axios from "axios";

export const tradeApi = async (coinCode = "BTC") => {
  try {
    const response = await axios.get(
      `https://api.bithumb.com/public/transaction_history/${coinCode}_KRW`
    );
    console.log(`${coinCode} 체결내역 성공`, response.data.data);
    return response.data.data;
  } catch (error) {
    console.log(`${coinCode} 체결내역 에러`, error);
    return [];
  }
};
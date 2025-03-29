import axios from "axios";

export const orderBookApi = async (coinCode = "BTC") => {
  try {
    const response = await axios.get(
      `https://api.bithumb.com/public/orderbook/${coinCode}_KRW`
    );
    console.log(`${coinCode} 호가 성공`, response.data.data);
    return response.data.data;
  } catch (error) {
    console.log(`${coinCode} 호가 에러:`, error);
    return null;
  }
};
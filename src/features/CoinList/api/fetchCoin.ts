import axios from "axios";

export const fetchCoin = async (sortList: string) => {
  const response = await axios.get(
    "http://116.126.197.110:30010/coin-name-list",
    {
      params: { userId: "alice001", state: sortList },
      headers: { accept: "application/json" },
    }
  );
  console.log("백엔드의 코인 차트 호출:", response.data);
  return response.data;
};

import axios from "axios";
import { userId } from "../../../shared/userId";

export const fetchCoin = async (sortList: string) => {
  const response = await axios.get(
    "http://116.126.197.110:30010/coin-name-list",
    {
      params: { userId, state: sortList },
      headers: { accept: "application/json" },
    }
  );
  console.log("백엔드의 코인 차트 호출:", response.data);
  return response.data;
};

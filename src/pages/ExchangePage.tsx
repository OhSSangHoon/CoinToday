import { CandleChart, OrderBook, Trade, OrderSetting } from "../features";
import { useParams } from "react-router-dom";
import useCoin from "../shared/hooks/useCoin";
import { useEffect, useState } from "react";
import { getUserCoinInfo } from "../shared/hooks/getUserCoinInto";
import { useUserId } from "../features/Mypage/model/userId";
import { UserAsset } from "../features/Mypage/model";


export default function ExchangePage() {
  const { coinCode } = useParams();
  const { setCoin } = useCoin();
  const { userId } = useUserId();
  const [userCoinInfo, setUserCoinInfo] = useState<UserAsset | null>(null);

  // 코인 코드 설정
  useEffect(() => {
    if (coinCode) {
      setCoin(coinCode);
    }
  }, [coinCode, setCoin]);


  // 사용자의 코인 보유 정보 가져오기
  useEffect(() => {
    if (!userId || !coinCode) return;

    const fetchUserCoinInfo = async () => {
      try {
        const coinInfo = await getUserCoinInfo(userId, coinCode);
        setUserCoinInfo(coinInfo);
        
        // 콘솔에 사용자 코인 정보 출력 (테스트용)
        if (coinInfo) {
          console.log("사용자 코인 보유 정보:", {
            코인명: coinInfo.coinName,
            보유수량: coinInfo.coinAmount,
            평균매수가: coinInfo.tradePrice
          });
        } else {
          console.log(`현재 ${coinCode} 코인을 보유하고 있지 않습니다.`);
        }
      } catch (error) {
        console.error("코인 정보 조회 실패:", error);
      }
    };

    fetchUserCoinInfo();
  }, [userId, coinCode]);


  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row relative">
        <div className="mt-10 w-[90rem] m-auto border border-gray-700">
          <CandleChart />
        </div>
      </div>
      <div className="flex flex-row w-[90rem] m-auto">
        <div className="float-left w-[66rem] border border-gray-700">
          <OrderBook />
        </div>
        <div className="float-right w-[24rem]">
          <OrderSetting />
        </div>
      </div>
      <div className="w-[90rem] m-auto">
        <Trade />
      </div>
    </div>
  );
}

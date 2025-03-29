import { CandleChart, OrderBook, Trade, OrderSetting } from "../features";
import { useParams } from "react-router-dom";
import useCoin from "../shared/hooks/useCoin";
import { useEffect } from "react";


export default function ExchangePage() {
  const { coinCode } = useParams();
  const { setCoin } = useCoin();

  useEffect(() => {
    if (coinCode) {
      setCoin(coinCode);
    }
  }, [coinCode, setCoin]);

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

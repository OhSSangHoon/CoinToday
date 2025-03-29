import { useCoin } from "../../../shared";
import { useTradeData } from "../model";


export default function Trade() {
  const { tradeData } = useTradeData();
  const { coin: selectedCoin } = useCoin();

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const time = date.toLocaleTimeString("ko-KR", { hour12: false });

    return (
      <span>
        <strong>{`${month}.${day}`}</strong> {time}
      </span>
    );
  };

  return (
    <div className="p-2 w-full h-[30rem] mx-auto flex flex-col overflow-y-hidden gap-1 bg-dark-bg shadow-lg rounded-2xl mb-10">
      <div className=" p-4 text-fc text-2g font-bold">체결내역</div>
      <div className="pr-4 pl-4 text-#333D4B text-2g font-bold">
        <div className=" flex flex-col h-full text-sm text-gray-700">
          <thead className="flex flex-row items-center gap-10 full text-[#9E9EA4] mb-4">
            <th className="py-2  w-[30rem] font-medium">체결시간</th>
            <th className="py-2  w-[15rem] font-medium">체결가격(KRW)</th>
            <th className="py-2  w-[15rem] font-medium">체결량({selectedCoin})</th>
            <th className="py-2  w-[30rem] font-medium">체결금액(KRW)</th>
          </thead>
          <div className="h-[20rem] flex flex-col overflow-y-scroll scrollbar-hide pt-2 text-fc">
            {tradeData.map((trade, index) => (
              <div
                key={index}
                className="flex flex-row w-full gap-10 text-center font-light hover:bg-[#D9D9FF1C] transition-all duration-100"
              >
                <div className="w-[30rem] h-[3rem] flex items-center justify-center">
                  {formatTime(trade.transaction_date)}
                </div>
                <div
                  className={`w-[15rem] h-[3rem] flex items-center justify-center ${trade.type === "bid" ? "text-red-500" : "text-blue-500"}`}
                >
                  {Number(trade.price).toLocaleString()}
                </div>
                <div className={`w-[15rem] h-[3rem] flex items-center justify-center ${trade.type === "bid" ? "text-red-500" : "text-blue-500"}`}>
                  {Number(trade.units_traded).toFixed(8)}
                </div>
                <div className="w-[30rem] h-[3rem] flex items-center justify-center">
                  {Number(trade.total).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

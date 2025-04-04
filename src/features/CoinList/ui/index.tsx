import { useCoin } from "../../../shared";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useCoinList } from "../model";
import useCoinTicker from "../model/useCoinTicker";

interface Market {
  coinCode: string;
  englishName: string;
  koreanName: string;
  rsi: string;
  like?: boolean;
}

// MarketList: memo로 감싸서 props가 변하지 않으면 리렌더링 방지
const MarketList = memo(
  ({
    market,
    ticker,
    onSelect,
  }: {
    market: Market;
    ticker: { price: string; changeRate: number; tradeVolume: string };
    onSelect: (code: string) => void;
  }) => {
    // 1. 이전 가격을 저장할 ref
    const prevPriceRef = useRef<string>(ticker.price);

    // 2. 깜박임 효과(배경색)를 위한 상태
    const [flashColor, setFlashColor] = useState<"red" | "blue" | null>(null);

    // 3. 가격 변동 감지
    useEffect(() => {
      const prevPrice = parseFloat(prevPriceRef.current);
      const currentPrice = parseFloat(ticker.price);

      // 가격이 달라졌을 때만 비교
      if (!isNaN(prevPrice) && prevPrice !== currentPrice) {
        if (currentPrice > prevPrice) {
          setFlashColor("red");
        } else if (currentPrice < prevPrice) {
          setFlashColor("blue");
        }

        const timer = setTimeout(() => {
          setFlashColor(null);
        }, 500); // 0.5초 후 깜박임 해제

        // cleanup
        return () => clearTimeout(timer);
      }

      prevPriceRef.current = ticker.price;
    }, [ticker.price]);

    return (
      <div
        onClick={() => {
          onSelect(market.coinCode);
        }}
        className={`rounded-md grid grid-cols-[1.3fr_2fr] px-2 cursor-pointer pb-3 
        hover:bg-gray-100 active:bg-orange-100  outline: 2px solid orange;
        ${ticker.changeRate > 0 ? "text-[#FF3435]" : "text-[#038DDC]"}
        ${
          flashColor === "red"
            ? "bg-red-100"
            : flashColor === "blue"
              ? "bg-blue-100"
              : ""
        }
       
      `}
      >
        <div className="flex flex-row justify-start items-center gap-4">
          <div className="text-[#9E9EA4] hover:text-yellow-500">
            {market.like ? "★" : "☆"}
          </div>
          <div className="grid grid-rows-2">
            <div>{market.koreanName}</div>
            <div className=" text-[#9E9EA4] text-[0.8rem]">
              {market.coinCode}/KRW
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[2fr_1.5fr_3fr_1fr] gap-3">
          <div className="text-right">{ticker.price}</div>
          <div className="text-right">{ticker.changeRate}%</div>
          <div className="text-right">
            {ticker.tradeVolume}
            <span className="text-[0.7rem] text-[#9E9EA4]">백만</span>
          </div>

          <div className="text-right">{market.rsi}</div>
        </div>
      </div>
    );
  }
);

const MemoizedMarketList = memo(MarketList);

const CoinListUi = () => {
  const { tickerList } = useCoinTicker();
  const { markets, setSortList } = useCoinList();
  const { handleSelectMarket, coin: selectedCoin } = useCoin();

  const tickerMap = useMemo(() => {
    return new Map(tickerList.map((t) => [t.coinCode, t]));
  }, [tickerList]);

  return (
    <div className="h-screen w-[30rem] flex flex-col items-center justify-center bg-white text-[0.9rem] px-2">
      <div className="flex flex-row gap-10 pb-4">
        <div className="text-black">
          정렬:
          <select
            className="text-black"
            onChange={(e) => setSortList(e.target.value)}
          >
            <option value="">기본</option>
            <option value="like">좋아요</option>
            <option value="rsi">rsi</option>
          </select>
        </div>
        <div className="text-black">선택한 코인:{selectedCoin}</div>
      </div>
      <div className="w-full text-black text-[0.6rem] grid grid-cols-[1fr_2.5fr_1fr_1fr_1fr] gap-2 place-items-end px-5 pb-1">
        <div>코인</div>
        <div>현재가</div>
        <div>변동률(24H)</div>
        <div>거래금액</div>
        <div>rsi지수</div>
      </div>
      <div className="h-[80vh] w-full overflow-auto">
        {markets.map((market: Market) => {
          const ticker = tickerMap.get(market.coinCode) || {
            price: "N/A",
            changeRate: 0,
            tradeVolume: "N/A",
          };

          return (
            <MemoizedMarketList
              key={market.coinCode}
              onSelect={handleSelectMarket}
              market={market}
              ticker={ticker}
            />
          );
        })}
      </div>
    </div>
  );
};

export default memo(CoinListUi);

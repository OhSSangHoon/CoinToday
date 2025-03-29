
import { useEffect } from "react";
import { useOrderSetting } from "../model/BuyModel";

export default function BuySection() {
  const {
    selectedMarket,
    selectedPriceType,
    setSelectedPriceType,
    quantity,
    setQuantity,
    price,
    setPrice,
    totalAmount,
    setTotalAmount,
    isLoading,
    increaseQuantity,
    decreaseQuantity,
    submitMarketBuy,
    submitLimitBuy,
    orderStatus,
    resetOrderStatus,
  } = useOrderSetting();

  useEffect(() => {
    console.log("현재 상태:", {
      수량: quantity,
      총액: totalAmount,
      가격: price,
      코인: selectedMarket,
      주문유형: selectedPriceType
    });
  }, [quantity, totalAmount, price, selectedMarket, selectedPriceType]);
  
  // 주문 상태 메시지가 표시된 후 일정 시간 후에 리셋
  useEffect(() => {
    if (orderStatus?.isSuccess || orderStatus?.error) {
      const timer = setTimeout(() => {
        resetOrderStatus();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [orderStatus?.isSuccess, orderStatus?.error, resetOrderStatus]);

  // 매수 버튼 클릭 핸들러
  const handleBuyClick = () => {
    
    // (실제로는 로그인 상태에서 가져와야 함)
    const userId = "root";

    // 시장가 매수
    if (selectedPriceType === "시장가") {
      if (!selectedMarket || !totalAmount || totalAmount === "0") {
        alert("코인과 매수 금액을 확인해주세요");
        return;
      }
      submitMarketBuy(userId);
    } else {
      // 지정가 매수
      console.log("지정가 매수", { price, quantity, totalAmount });
      submitLimitBuy(userId);
    }
  };
  
  return (
    <div className="w-full h-[85%] pt-4">
      <div className="flex flex-row justify-between items-center">

        <h1 className="text-white text-[1rem] font-bold">주문하기</h1>
        <div className="flex flex-row justify-between items-center bg-[#34343F] rounded-md p-2 gap-2">
          <button 
            className={`w-[7rem] h-[2.3rem] rounded-md text-[#c3c3c6] text-[1rem] hover:bg-[#17171c] ${selectedPriceType === "지정가" ? "bg-[#17171c]" : ""} transition-all duration-200`} 
            onClick={() => setSelectedPriceType("지정가")}
          >
            지정가
          </button>
          <button 
            className={`w-[7rem] h-[2.3rem] rounded-md text-[#c3c3c6] text-[1rem] hover:bg-[#17171c] ${selectedPriceType === "시장가" ? "bg-[#17171c]" : ""} transition-all duration-200`} 
            onClick={() => setSelectedPriceType("시장가")}
          >
            시장가
          </button>
        </div>
      </div>
      
      {/* 가격 입력 섹션 - 시장가일 때는 비활성화 */}
      <div className="flex flex-row justify-between items-center mt-4">
        <h1 className="text-white text-[1rem] font-bold">구매가격</h1>

        <div className="flex flex-row justify-between items-center rounded-md">
          {isLoading ? (
            <div className="w-[15.6rem] h-[2.3rem] rounded-md bg-[#17171c] flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <input 
              type="text" 
              className={`w-[15.6rem] h-[2.3rem] rounded-md text-[#c3c3c6] text-[1rem] bg-[#17171c] border-none outline-none p-2 ${selectedPriceType === "시장가" ? "opacity-50" : ""}`}
              placeholder={selectedPriceType === "시장가" ? "시장가 주문" : "가격 입력"}
              value={selectedPriceType === "시장가" ? "시장가" : price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={selectedPriceType === "시장가"}
            />
          )}
        </div>
      </div>
      {/* 수량 입력 섹션 - 시장가일 때는 비활성화 */}
      <div className="flex flex-row justify-between items-center mt-4">
        <h1 className="text-white text-[1rem] font-bold">수량</h1>
        <div className="flex flex-row justify-between items-center rounded-md">
          <input 
            type="text" 
            className={"w-[11rem] h-[2.3rem] rounded-l-md text-[#c3c3c6] text-[1rem] bg-[#17171c] border-none outline-none p-2"}
            placeholder={`${selectedMarket || ''} 수량`}
            value={quantity}

            onChange={(e) => {
              // 수량 입력 시 정확한 값 처리
              const inputValue = e.target.value;
              
              // 숫자와 소수점만 허용하는 정규식 패턴
              const regex = selectedMarket === "BTC" 
                ? /^[0-9]*\.?[0-9]{0,8}$/ 
                : /^[0-9]*\.?[0-9]{0,4}$/;
                
              // 빈 값이거나 패턴에 맞는 경우만 허용
              if (inputValue === '' || regex.test(inputValue)) {
                setQuantity(inputValue);
              }
            }}

          />
          <button 
            className={"w-[2.3rem] h-[2.3rem] text-[#c3c3c6] text-[1.5rem] bg-[#17171c] border-none outline-none"}
            onClick={decreaseQuantity}
          >
            -
          </button>
          <button 
            className={"w-[2.3rem] h-[2.3rem] text-[#c3c3c6] font-semibold text-[1rem] bg-[#17171c] border-none outline-none rounded-r-md"}
            onClick={increaseQuantity}
          >
            +
          </button>
        </div>
      </div>
      
      {/* 총액 입력 섹션 */}
      <div className="flex flex-row justify-between items-center mt-4">
        <h1 className="text-white text-[1rem] font-bold">총액</h1>
        <div className="flex flex-row justify-between items-center rounded-md relative">
          <input 
            type="text" 
            className="w-[15.6rem] h-[2.3rem] rounded-md text-[#c3c3c6] text-[1rem] bg-[#17171c] border-none outline-none p-2 pr-12" 
            placeholder="총액 입력"
            value={totalAmount === "0" ? "" : totalAmount}
            onChange={(e) => {
              const cleanValue = e.target.value.replace(/[^0-9]/g, '');
              setTotalAmount(cleanValue);
            }}
          />
          <span className="absolute right-3 text-[#c3c3c6]">KRW</span>
        </div>
      </div>
      {/* 구매 버튼 */}
      <div className="mt-6">
        <button 
          className="w-full h-[3rem] bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-all duration-200"
          disabled={
            !selectedMarket || 
            orderStatus?.isSubmitting || 
            (selectedPriceType === "시장가" ? (!totalAmount || totalAmount === "0") : (!price || !quantity))
          }
          onClick={handleBuyClick}
        >
          {orderStatus?.isSubmitting ? "주문 처리 중..." : `${selectedPriceType} 매수하기`}
        </button>
      </div>
      {/* 주문 상태 메시지 */}
      {orderStatus?.isSuccess && (
        <div className="fixed top-[5rem] left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 bg-green-500 bg-opacity-20 text-green-400 rounded-md text-center">
          매수 주문이 성공적으로 처리되었습니다.
        </div>
      )}
      
      {orderStatus?.error && (
        <div className="fixed top-[5rem] left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 bg-red-500 bg-opacity-20 text-red-400 rounded-md text-center">
          오류: {orderStatus.error}
        </div>
      )}
    </div>
  );
}
export default function MypageUi() {
  return (
    <div className="bg-[#101013] w-[90rem] m-auto text-white p-4 max-w-md mx-auto rounded-lg">
      {/* 보유 현황 섹션 */}
      <div className="bg-[#101010] p-4 rounded-lg mb-6">
        <h2 className="text-lg font-medium mb-4">보유 현황</h2>
        
        {/* 도넛 차트 영역 */}
        <div className="relative w-48 h-48 mx-auto mb-4">
          {/* 도넛 차트는 실제 구현에서는 chart.js나 recharts 등의 라이브러리 사용 */}
          {/* 여기서는 시각적 표현만 구현 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full"></div>
          </div>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#9FEE00" strokeWidth="20" strokeDasharray="150 250" />
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8B008B" strokeWidth="20" strokeDasharray="103 397" strokeDashoffset="-150" />
          </svg>
        </div>
        
        {/* 차트 범례 */}
        <div className="flex flex-wrap justify-center gap-4 mb-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-lime-400 mr-1"></div>
            <span className="text-xs">KRW</span>
            <span className="text-xs ml-2">36.4%</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-900 mr-1"></div>
            <span className="text-xs">BTC</span>
            <span className="text-xs ml-2">27.3%</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
            <span className="text-xs">ETH</span>
            <span className="text-xs ml-2">20.2%</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-600 mr-1"></div>
            <span className="text-xs">XRP</span>
            <span className="text-xs ml-2">16.1%</span>
          </div>
        </div>
      </div>
      
      {/* 거래 내역 섹션 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">거래 내역</h2>
        </div>
        <div className="border-b border-gray-700 mb-4"></div>
        
        <p className="text-sm text-gray-400 mb-4">주문가능 금액 0원</p>
        
        {/* 탭 메뉴 */}
        <div className="flex mb-6">
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md mr-2">전체</button>
          <button className="px-4 py-2 bg-transparent text-gray-400 text-sm mr-2">매수</button>
          <button className="px-4 py-2 bg-transparent text-gray-400 text-sm mr-2">매도</button>
          <button className="px-4 py-2 bg-transparent text-gray-400 text-sm">출금</button>
        </div>
        
        {/* 거래 목록 */}
        <div className="space-y-4">
          {/* 거래 아이템 1 */}
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <span className="text-gray-400 mr-2">3.4</span>
                <span className="font-medium">BTC</span>
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <span>05:50</span>
                <span className="mx-2">|</span>
                <span className="text-red-500">매수 완료</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-medium">10 BTC</span>
            </div>
          </div>
          
          {/* 거래 아이템 2 */}
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <span className="text-gray-400 mr-2">3.4</span>
                <span className="font-medium">XRP</span>
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <span>04:21</span>
                <span className="mx-2">|</span>
                <span className="text-blue-500">매도</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-medium">14115.02490000 XRP</span>
            </div>
          </div>
          
          {/* 거래 아이템 3 */}
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <span className="text-gray-400 mr-2">3.3</span>
                <span className="font-medium">ETH</span>
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <span>13:34</span>
                <span className="mx-2">|</span>
                <span className="text-red-500">매수</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-medium">5.82340011 ETH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
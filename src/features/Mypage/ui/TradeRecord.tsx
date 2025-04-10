import { useEffect, useState, useRef, RefObject } from 'react';
import { TradeRecord, OpenOrder } from '../model/index';
import { getUserTradeRecords, getUserOpenOrders } from '../api/index';
import { useInfiniteScroll } from '../../../shared/hooks/useInfiniteScroll';

interface TradeRecordSectionProps {
  userId: string | null;
}

export default function TradeRecordSection({ userId }: TradeRecordSectionProps) {
  const [tradeRecords, setTradeRecords] = useState<TradeRecord[]>([]);
  const [buyRecords, setBuyRecords] = useState<TradeRecord[]>([]);
  const [sellRecords, setSellRecords] = useState<TradeRecord[]>([]);
  const [openOrders, setOpenOrders] = useState<OpenOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'open'>('buy'); // 현재 활성 탭
  const scrollContainerRef = useRef<HTMLDivElement>(null); // 스크롤 컨테이너 참조 추가

  // 거래 내역 로드
  useEffect(() => {
    if (!userId) return;
    
    const fetchTradeRecords = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 거래 내역 가져오기
        const records = await getUserTradeRecords(userId);
        
        // 최신순 정렬 (거래 시간 기준)
        const sortedRecords = [...records].sort((a, b) => {
          const dateA = new Date(a.tradeTime).getTime();
          const dateB = new Date(b.tradeTime).getTime();
          return dateB - dateA;
        });
        
        setTradeRecords(sortedRecords);
        
        // 매수/매도 기록 분리
        const buys = sortedRecords.filter(record => record.state === 'buy');
        const sells = sortedRecords.filter(record => record.state === 'sell');
        setBuyRecords(buys);
        setSellRecords(sells);
        
        // 미체결 주문 가져오기
        const orders = await getUserOpenOrders(userId);
        setOpenOrders(orders);
      } catch (error: any) {
        console.error('거래 내역 로드 오류:', error);
        setError(`거래 내역을 불러올 수 없습니다: ${error.message || '알 수 없는 오류'}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTradeRecords();
  }, [userId]);
  
  // 무한 스크롤 훅 사용 - 매수 내역
  const buyScrollData = useInfiniteScroll({
    items: buyRecords,
    initialCount: 5,
    incrementCount: 5,
    scrollContainer: scrollContainerRef as RefObject<HTMLElement>,
    rootMargin: '20px',
    threshold: 0.1,
    activeCondition: activeTab === 'buy' ? activeTab : null
  });
  
  // 무한 스크롤 훅 사용 - 매도 내역
  const sellScrollData = useInfiniteScroll({
    items: sellRecords,
    initialCount: 5,
    incrementCount: 5,
    scrollContainer: scrollContainerRef as RefObject<HTMLElement>,
    rootMargin: '20px',
    threshold: 0.1,
    activeCondition: activeTab === 'sell' ? activeTab : null
  });
  
  // 무한 스크롤 훅 사용 - 미체결 주문
  const openOrdersScrollData = useInfiniteScroll({
    items: openOrders,
    initialCount: 5,
    incrementCount: 5,
    scrollContainer: scrollContainerRef as RefObject<HTMLElement>,
    rootMargin: '20px',
    threshold: 0.1,
    activeCondition: activeTab === 'open' ? activeTab : null
  });
  
  // 날짜 형식 변환 함수
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // 금액 형식 변환 함수
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };
  
  // 거래 내역 항목 렌더링 함수
  const renderTradeItem = (record: TradeRecord, index: number) => {
    return (
      <div 
        key={index} 
        className="bg-gray-800 rounded-lg p-4 flex flex-col mb-1"
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <span className="font-medium">{record.coinName}</span>
            <span 
              className={`ml-2 px-2 py-0.5 rounded text-xs ${
                record.state === 'buy' 
                  ? 'bg-green-900 text-green-300' 
                  : 'bg-red-900 text-red-300'
              }`}
            >
              {record.state === 'buy' ? '매수' : '매도'}
            </span>
          </div>
          <span className="text-sm text-gray-400">{formatDate(record.tradeTime)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="text-gray-400">수량: </span>
            <span>{record.amount.toLocaleString(undefined, { maximumFractionDigits: 8 })}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-400">단가: </span>
            {/* 소수점 자리수 제한 */}
            <span>
              {new Intl.NumberFormat('ko-KR', {
                style: 'currency',
                currency: 'KRW',
                minimumFractionDigits: 0,
                maximumFractionDigits: 3
              }).format(record.tradePrice)}
            </span>
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-700 flex justify-between items-center">
          <span className="text-sm text-gray-400">총액</span>
          <span className="font-medium text-lg">{formatCurrency(record.coinSum)}</span>
        </div>
      </div>
    );
  };
  
  // 미체결 주문 항목 렌더링 함수
  const renderOpenOrderItem = (order: OpenOrder, index: number) => {
    return (
      <div 
        key={index} 
        className="bg-gray-800 rounded-lg p-4 flex flex-col mb-1"
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <span className="font-medium">{order.coinName}</span>
            <span 
              className={`ml-2 px-2 py-0.5 rounded text-xs ${
                order.type === 'buy' 
                  ? 'bg-green-900 text-green-300' 
                  : 'bg-red-900 text-red-300'
              }`}
            >
              {order.type === 'buy' ? '매수' : '매도'}
            </span>
          </div>
          <span className="text-sm text-gray-400">주문 ID: {order.orderId.substring(0, 8)}...</span>
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-700 flex justify-between items-center">
          <span className="text-sm text-gray-400">상태</span>
          <span className="font-medium text-yellow-400">미체결</span>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      {error ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-red-500">{error}</p>
        </div>
      ) : tradeRecords.length === 0 && openOrders.length === 0 && !isLoading ? (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-400">거래 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="p-3">
          <div className="flex mb-4 gap-2">
            <button
              className={`px-4 py-1 rounded-md text-sm ${activeTab === 'buy' ? 'bg-green-600 text-white font-medium' : 'bg-gray-700 text-gray-400'}`}
              onClick={() => setActiveTab('buy')}
            >
              매수
            </button>
            <button
              className={`px-4 py-1 rounded-md text-sm ${activeTab === 'sell' ? 'bg-red-600 text-white font-medium' : 'bg-gray-700 text-gray-400'}`}
              onClick={() => setActiveTab('sell')}
            >
              매도
            </button>
            <button
              className={`px-4 py-1 rounded-md text-sm ${activeTab === 'open' ? 'bg-yellow-600 text-white font-medium' : 'bg-gray-700 text-gray-400'}`}
              onClick={() => setActiveTab('open')}
            >
              미체결
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <div 
              ref={scrollContainerRef}
              className="overflow-y-auto scrollbar-hide max-h-[320px] rounded-lg" 
            >
              {activeTab === 'buy' && (
                <div className="pb-2">
                  {buyScrollData.visibleItems.length > 0 ? (
                    <>
                      {buyScrollData.visibleItems.map((record, index) => renderTradeItem(record, index))}
                      {buyScrollData.renderLoader()}
                    </>
                  ) : (
                    <div className="bg-gray-800 rounded-lg p-6 text-center">
                      <p className="text-gray-400">매수 내역이 없습니다.</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'sell' && (
                <div className="pb-2">
                  {sellScrollData.visibleItems.length > 0 ? (
                    <>
                      {sellScrollData.visibleItems.map((record, index) => renderTradeItem(record, index))}
                      {sellScrollData.renderLoader()}
                    </>
                  ) : (
                    <div className="bg-gray-800 rounded-lg p-6 text-center">
                      <p className="text-gray-400">매도 내역이 없습니다.</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'open' && (
                <div className="pb-2">
                  {openOrdersScrollData.visibleItems.length > 0 ? (
                    <>
                      {openOrdersScrollData.visibleItems.map((order, index) => renderOpenOrderItem(order, index))}
                      {openOrdersScrollData.renderLoader()}
                    </>
                  ) : (
                    <div className="bg-gray-800 rounded-lg p-6 text-center">
                      <p className="text-gray-400">미체결 주문이 없습니다.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
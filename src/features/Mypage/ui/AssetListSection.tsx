import { useRef, useMemo, RefObject } from 'react';
import { useInfiniteScroll } from '../../../shared/hooks/useInfiniteScroll';
import { UserAsset } from '../model';

interface AssetListSectionProps {
  assets: UserAsset[];
  colorMapping: Record<string, string>;
}

export default function AssetListSection({ assets, colorMapping }: AssetListSectionProps) {
  // 스크롤 컨테이너 참조
  const assetsContainerRef = useRef<HTMLDivElement>(null);
  
  // 정렬된 자산 목록 계산
  const sortedAssets = useMemo(() => {
    if (!assets.length) return [];
    
    // 가치 순으로 정렬
    return [...assets].sort(
      (a, b) => (b.coinAmount * b.tradePrice) - (a.coinAmount * a.tradePrice)
    );
  }, [assets]);
  
  // 무한 스크롤 훅 사용
  const assetsScrollData = useInfiniteScroll({
    items: sortedAssets,
    initialCount: 5,
    incrementCount: 5,
    scrollContainer: assetsContainerRef as RefObject<HTMLElement>,
    rootMargin: '50px',
    threshold: 0.1,
    activeCondition: 'assets' // 항상 활성화
  });

  // 숫자 포맷팅 함수
  const formatNumber = (value: number, maxDigits = 8) => {
    return value.toLocaleString(undefined, { maximumFractionDigits: maxDigits });
  };
  
  return (
    <div 
      ref={assetsContainerRef}
      className="bg-[#101010] rounded-lg max-h-[500px] overflow-y-auto scrollbar-hide p-3"
    >
      <div className="space-y-3">
        {assets.length > 0 ? (
          <>
            {assetsScrollData.visibleItems.map((asset, index) => {
              const dotColor = colorMapping[asset.coinName]
              const totalValue = asset.coinAmount * asset.tradePrice;
              
              return (
                <div 
                  key={index} 
                  className="bg-gray-800 hover:bg-gray-750 rounded-xl p-4 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div 
                        className="w-8 h-8 rounded-full mr-3 flex items-center justify-center"
                        style={{ backgroundColor: `${dotColor}20` }}
                      >
                        <div 
                          className="w-5 h-5 rounded-full"
                          style={{ backgroundColor: dotColor }}
                        ></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-base">{asset.coinName}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-base text-white">
                        {formatNumber(Math.floor(totalValue))}
                        <span className="text-xs ml-1 text-gray-300">원</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">보유수량</p>
                      <p className="font-medium">
                        {formatNumber(asset.coinAmount)}
                        <span className="text-xs ml-1 text-gray-400">{asset.coinName}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-1">현재 시세</p>
                      <p className="font-medium">
                        {formatNumber(Math.floor(asset.tradePrice))}
                        <span className="text-xs ml-1 text-gray-400">원</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* 로딩 인디케이터 */}
            {assetsScrollData.renderLoader()}
          </>
        ) : (
          <div className="bg-gray-800 rounded-xl p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-400 font-medium">코인을 보유하고 있지 않습니다.</p>
            <p className="text-xs text-gray-500 mt-2">현재 보유한 가상화폐가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
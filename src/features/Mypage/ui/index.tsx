import { useEffect, useState, useMemo } from 'react';
import { getUserFinancialInfo } from '../api';
import { UserFinancial, calculateAssetDistribution } from '../model';
import { useUserId } from '../model/userId';
import TradeRecordSection from './TradeRecord';
import AssetListSection from './AssetListSection';

export default function MypageUi() {
  // 사용자 ID와 닉네임 가져오기
  const { userId, nickName } = useUserId();
  
  // 상태 관리
  const [financialInfo, setFinancialInfo] = useState<UserFinancial>({ userAssets: [], cash: 0, availableCash: 0 });
  const [assetDistribution, setAssetDistribution] = useState<{ name: string; value: number; percentage: number }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<'assets' | 'trades'>('assets'); // 메인 탭 상태
  
  const customColors = ["#B6DA03", "#692667", "#038DCC", "#FF3435", "#ff9000", "#12d8ff"];
  
  // 사용자 자산 정보 가져오기
  useEffect(() => {
    if (!userId) return;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('현재 사용자 ID:', userId);
        
        // 사용자 자산 정보 가져오기
        const financialData = await getUserFinancialInfo(userId);
        setFinancialInfo(financialData);
        
        // 자산 분포 계산
        const distribution = calculateAssetDistribution(financialData);

        // 분포를 값이 큰 순서대로 정렬
        const sortedDistribution = [...distribution].sort((a, b) => b.value - a.value);
        setAssetDistribution(sortedDistribution);
        
      } catch (error: any) {
        console.error('데이터 로드 오류:', error);
        setError(`데이터를 불러올 수 없습니다: ${error.message || '알 수 없는 오류'}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [userId]);

  // 코인 이름에 따른 색상 맵핑
  const assetColorMapping = useMemo(() => {
    return assetDistribution.reduce((mapping, asset, index) => {
      mapping[asset.name] = index < customColors.length ? customColors[index] : `hsl(${Math.random() * 60}, 70%, 50%)`;
      return mapping;
    }, {} as Record<string, string>);
  }, [assetDistribution]);
  
  // 도넛 차트 SVG 생성을 위한 데이터 계산
  const generateChartSegments = () => {
    // 데이터가 없으면 빈 원 반환
    if (assetDistribution.length === 0) {
      return (
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#333333"
          strokeWidth="20"
        />
      );
    }
    
    let cumulativePercentage = 0;
    return assetDistribution.map((asset, index) => {
      const startPercentage = cumulativePercentage;
      cumulativePercentage += asset.percentage;
      
      // SVG 원형 차트를 위한 값 계산
      // 원의 둘레: 2 * PI * r = 2 * PI * 40 ≈ 251.33
      const dashArray = `${(asset.percentage * 251.33) / 100} 251.33`;
      const dashOffset = `-${(startPercentage * 251.33) / 100}`;

      return (
        <circle
          key={index}
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke={assetColorMapping[asset.name]}
          strokeWidth="20"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
        />
      );
    });
  };
  
  return (
    <div className="bg-[#101013] w-[30rem] mx-auto text-white p-4 rounded-lg">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>로딩 중...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-medium mb-4">{nickName}님의 보유 현황</h2>
          
          <div className="flex items-start justify-between mb-4 relative">
            {/* 도넛 차트 영역 */}
            <div className="relative w-full h-48 flex justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full"></div>
              </div>
              <svg viewBox="0 0 100 100">
                {generateChartSegments()}
              </svg>
            </div>
          </div>
          
          {/* 차트 범례 */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {assetDistribution.length > 0 ? (
              assetDistribution.map((asset, index) => {
                const dotColor = assetColorMapping[asset.name];
                return (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-1" 
                      style={{ backgroundColor: dotColor }}
                    ></div>
                    <span className="text-xs">{asset.name}</span>
                    <span className="text-xs ml-2">{asset.percentage.toFixed(1)}%</span>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-400 text-xs">표시할 자산이 없습니다</div>
            )}
          </div>

          {/* 총자산 */}
          <div className="flex items-center justify-center">
              <div className="flex flex-row gap-4">
                <div className="p-3 rounded-lg">
                  <p className="text-sm text-gray-300">총 자산</p>
                  <p className="text-md font-medium">
                    {Math.floor(financialInfo.userAssets.reduce((sum, asset) => 
                      sum + asset.coinAmount * asset.tradePrice, 0) + financialInfo.cash).toLocaleString()}원
                  </p>
                </div>
                <div className="p-3 rounded-lg">
                  <p className="text-sm text-gray-300">주문가능금액</p>
                  <p className="text-md font-medium">
                    {Math.floor(financialInfo.availableCash).toLocaleString()}원
                  </p>
                </div>
              </div>
            </div>
          
          {/* 메인 탭 네비게이션 */}
          <div className="flex border-b border-gray-700 mb-4">
            <button
              className={`flex-1 py-3 text-center ${activeMainTab === 'assets' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-400'}`}
              onClick={() => setActiveMainTab('assets')}
            >
              보유코인 목록
            </button>
            <button
              className={`flex-1 py-3 text-center ${activeMainTab === 'trades' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-400'}`}
              onClick={() => setActiveMainTab('trades')}
            >
              거래 내역
            </button>
          </div>
          
          {/* 탭 내용 */}
          {activeMainTab === 'assets' ? (
            <AssetListSection 
              assets={financialInfo.userAssets} 
              colorMapping={assetColorMapping} 
            />
          ) : (
            <TradeRecordSection userId={userId} />
          )}
        </>
      )}
    </div>
  );
}
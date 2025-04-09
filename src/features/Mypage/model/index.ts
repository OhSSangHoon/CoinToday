// 코인 자산 정보 인터페이스
export interface CoinDataItem {
  coinName: string; // 코인 이름
  coinAmount: string; // 코인 수량
  tradePrice: string; // 체결 가격
  cash: string; // 현금
}

// 사용자 자산 정보 인터페이스
export interface UserAsset {
  coinName: string; // 보유한 코인 이름
  coinAmount: number; // 보유한 코인 수량
  tradePrice: number; // 체결 가격
}

// 사용자 금융 정보 인터페이스
export interface UserFinancial {
  userAssets: UserAsset[];  // 사용자가 보유한 코인 목록
  cash: number; // 보유 현금
}

// 거래 내역 인터페이스
export interface TradeRecord {
  coinName: string; // 코인 이름
  state: 'buy' | 'sell' // 거래 유형 (매수, 매도)
  amount: number; // 수량
  tradePrice: number;  // 가격
  tradeTime: string;  // 거래 시간
  coinSum: number; // 코인 총 가치
}

// 거래 내역 응답 인터페이스
export interface TradeRecordResponse {
  records: TradeRecord[]; // 거래 내역 목록
}

export const calculateAssetDistribution = (userFinancial: UserFinancial): {
  name: string;
  value: number;
  percentage: number;
}[] => {
  const { userAssets, cash } = userFinancial;
  
  // 실제 가치 계산
  const assetValues = userAssets.map(asset => ({
    name: asset.coinName,
    value: asset.coinAmount * asset.tradePrice
  }));
  
  // 총 자산 가치
  const totalAssetValue = assetValues.reduce((sum, asset) => sum + asset.value, 0) + cash;
  
  let assetDistribution: {name: string; value: number; percentage: number}[] = [];
  
  // 코인 자산이 없으면(현금만 있으면) 현금이 100%
  if (userAssets.length === 0 || assetValues.every(asset => asset.value === 0)) {
    assetDistribution.push({
      name: 'KRW',
      value: cash,
      percentage: 100
    });
    return assetDistribution;
  }
  
  // 현금 추가
  const cashPercentage = (cash / totalAssetValue) * 100;
  assetDistribution.push({
    name: 'KRW',
    value: cash,
    percentage: cashPercentage
  });
  
  // 코인 추가 (최소 1%)
  const MIN_PERCENTAGE = 1; // 최소 표시 비율
  let remainingPercentage = 100 - cashPercentage;
  
  // 최소 비율을 적용한 후 남은 비율
  const minPercentageTotal = userAssets.length * MIN_PERCENTAGE;
  let adjustablePercentage = remainingPercentage - minPercentageTotal;
  
  // 각 코인의 실제 비율 계산
  if (totalAssetValue > 0) {
    const totalCoinValue = totalAssetValue - cash;
    
    // totalCoinValue가 0이 아닐 때만 계산
    if (totalCoinValue > 0) {
      userAssets.forEach(asset => {
        const value = asset.coinAmount * asset.tradePrice;
        // 코인 중 상대적 비중
        const relativeWeight = value / totalCoinValue;
        
        // 최소 비율 + 상대 비중에 따른 추가 비율
        let percentage = MIN_PERCENTAGE;
        if (adjustablePercentage > 0 && relativeWeight > 0) {
          percentage += adjustablePercentage * relativeWeight;
        }
        
        assetDistribution.push({
          name: asset.coinName,
          value,
          percentage
        });
      });
    } 
    // 코인 가치가 0이면 각 코인에 동일한 비율 할당
    else if (userAssets.length > 0) {
      const equalPercentage = remainingPercentage / userAssets.length;
      userAssets.forEach(asset => {
        assetDistribution.push({
          name: asset.coinName,
          value: asset.coinAmount * asset.tradePrice,
          percentage: equalPercentage
        });
      });
    }
  }
  
  return assetDistribution;
};
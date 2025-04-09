import { TradeRecord, TradeRecordResponse, CoinDataItem, UserAsset, UserFinancial } from '../model/index.ts';



// 사용자 자산 정보 조회
export const getUserFinancialInfo = async (userId: string): Promise<UserFinancial> => {
  try {
    const url = `http://116.126.197.110:30010/get-user-cash?userId=${userId}`;
    console.log('API 요청 URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`);
    
    const data = await response.json();
    console.log('API 응답 데이터:', data);
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('유효하지 않은 응답 데이터');
    }
    
    // 현금 데이터 변환
    const cash = parseFloat(data[0].cash) || 0;
    
    // 코인 자산 데이터 변환
    const userAssets: UserAsset[] = data.map((item: CoinDataItem) => ({
      coinName: item.coinName,
      coinAmount: parseFloat(item.coinAmount) || 0,
      tradePrice: parseFloat(item.tradePrice) || 0,
    }));
    
    return { userAssets, cash };
    
  } catch (error) {
    console.error('자산 정보 조회 실패:', error);
    return { userAssets: [], cash: 0 };
  }
};


// 거래 내역 조회
export const getUserTradeRecords = async (userId: string): Promise<TradeRecord[]> => {
  try {
    const url = `http://116.126.197.110:30010/user-trade-record?userId=${userId}`;
    console.log('거래 내역 API 요청:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('거래 내역 API 응답:', data);
    
    // 데이터 유효성 검사
    if (!Array.isArray(data)) {
      throw new Error('유효하지 않은 응답 데이터');
    }
    
    // 응답 데이터 형식화
    const tradeRecords: TradeRecord[] = data.map((record: any) => ({
      coinName: record.coinName,
      state: record.state,
      amount: parseFloat(record.amount) || 0,
      tradePrice: parseFloat(record.tradePrice) || 0,
      tradeTime: record.tradeTime,
      coinSum: parseFloat(record.coinSum) || 0,
    }));
    
    return tradeRecords;
    
  } catch (error) {
    console.error('거래 내역 조회 실패:', error);
    // 오류 발생 시 빈 배열 반환
    return [];
  }
};

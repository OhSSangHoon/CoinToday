import { TradeRecord, CoinDataItem, UserAsset, UserFinancial, OpenOrder } from '../model/index.ts';

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
    // 주문 가능 원화 추가
    const availableCash = parseFloat(data[0].availableCash) || 0;
    
    // 코인 자산 데이터 변환
    const userAssets: UserAsset[] = data.map((item: CoinDataItem) => ({
      coinName: item.coinName,
      coinAmount: parseFloat(item.coinAmount) || 0,
      tradePrice: parseFloat(item.tradePrice) || 0,
    }));
    
    return { userAssets, cash, availableCash };
    
  } catch (error) {
    console.error('자산 정보 조회 실패:', error);
    return { userAssets: [], cash: 0, availableCash: 0 };
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
      orderId: record.orderId,
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

// 주문 내역 조회
export const getUserOpenOrders = async (userId: string): Promise<OpenOrder[]> => {
  try{
    const url = `http://116.126.197.110:30010/open-orders?userId=${userId}`;
    console.log('API 요청 URL:', url);

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
    console.log('API 응답 데이터:', data);

    if (!Array.isArray(data)) {
      throw new Error('유효하지 않은 응답 데이터');
    }

    const openOrders: OpenOrder[] = data.map((order: any) => ({
      orderId: order.orderId,
      coinName: order.coinName,
      type: order.type,
      amount: parseFloat(order.amount) || 0,
      price: parseFloat(order.price) || 0,
      totalAmount: parseFloat(order.totalAmount) || 0,
      createdAt: order.createdAt,
    }));

    return openOrders;
  } catch (error) {
    console.error('주문 내역 조회 실패:', error);
    return [];
  }
};

// 자동 매매 주문 취소
export const cancelAutoTradeOrder = async (userId: string): Promise<boolean> => {
  try {
    const url = `http://116.126.197.110:30010/stop-auto-trade`;
    console.log('자동 매매 주문 취소 요청:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    console.log('자동 매매 주문 취소 응답:', data);

    return data.success === true;
  } catch (error) {
    console.error('자동 매매 주문 취소 실패:', error);
    return false;
  }
};

// 지정가 매수 주문 취소
export const cancelLimitOrder = async (
  userId: string,
  coinName: string,
  orderId: string,
  type: 'bid' | 'ask'
): Promise<boolean> => {
  try {
    const url = `http://116.126.197.110:30010/cancel-limit-order`;
    console.log('지정가 주문 취소 요청:', url);
    console.log('요청 데이터:', { userId, order_currency: coinName, order_id: orderId, type });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        order_currency: coinName,
        order_id: orderId,
        type
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API 요청 실패: ${response.status}`, errorText);
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const responseText = await response.text();
    console.log('지정가 주문 취소 응답:', responseText);

    return responseText.includes('success');
  } catch (error) {
    console.error('지정가 주문 취소 실패:', error);
    return false;
  }
};
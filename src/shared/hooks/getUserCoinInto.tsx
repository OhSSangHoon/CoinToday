import { getUserFinancialInfo } from "../../features/Mypage/api";
import { UserAsset } from "../../features/Mypage/model";

export const getUserCoinInfo = async (
  userId: string,
  coinCode: string
): Promise<UserAsset | null> => {
  try {
    if (!userId || !coinCode) {
      return null;
    }
    
    // 사용자 자산 정보 가져오기
    const financialInfo = await getUserFinancialInfo(userId);
    
    // 현재 선택된 코인에 대한 보유 정보 찾기
    const coinHolding = financialInfo.userAssets.find(
      (asset) => asset.coinName === coinCode
    );
    
    // 코인을 보유하고 있고 수량이 0보다 큰 경우에만 정보 반환
    if (coinHolding && coinHolding.coinAmount > 0) {
      return coinHolding;
    }
    
    return null;
  } catch (error) {
    console.error("코인 보유 정보 로드 실패:", error);
    return null;
  }
};
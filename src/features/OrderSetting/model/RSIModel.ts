import { useState, useCallback } from "react";
import { submitMarketTAOrder, cancelRSIOrder } from "../api/BuyApi";

interface RSIParams {
  rsi: string;
  state: "bid" | "ask";
  intervals: string;
}

interface RSIOrderStatus {
    isSubmitting: boolean;
    isSuccess: boolean | null;
    error: string | null;
}

interface RSIPendingOrder  {
    id: string;
    userId: string;
    coinName: string;
    cash: string;
    rsi: string;
    state: "bid" | "ask";
    intervals: string;
    timestamp: number;
}

export function useRSIModel() {
    const [rsiParams, setRSIParams] = useState<RSIParams>({
        rsi: "30",
        state: "bid",
        intervals: "24h"
    });
    
    const [orderStatus, setOrderStatus] = useState<RSIOrderStatus>({
        isSubmitting: false,
        isSuccess: null,
        error: null
    });

    // 대기중인 RSI 주문 목록
    const [pendingOrders, setPendingOrders] = useState<RSIPendingOrder[]>([]);

    // 취소 중인 주문 여부
    const [isCancelling, setIsCancelling] = useState(false);
    
    const updateRSIParams = useCallback((params: Partial<RSIParams>) => {
        setRSIParams((prevParams) => ({ ...prevParams, ...params }));
    }, []);

    const setRSIValue = useCallback((value: string) => {
        if(value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
            updateRSIParams({ rsi: value });
        }
    }, [updateRSIParams]);

    const setInterval = useCallback((intervals: string) => {
        updateRSIParams({ intervals });
    }, [updateRSIParams]);

    const setTradeState = useCallback((state: "bid" | "ask") => {
        updateRSIParams({ state });
    }, [updateRSIParams]);

    const cancleRSIOrder = useCallback(async (orderId: string) => {
        const order = pendingOrders.find(order => order.id === orderId);
        if(!order){
            return false;
        }

        setIsCancelling(true);

        try {
            // API 호출 시 타임아웃 설정 추가
            const result = await Promise.race([
                cancelRSIOrder(order.userId),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error("요청 시간 초과")), 10000)
                )
            ]) as boolean;

            if(result){
                setPendingOrders(prevOrders => prevOrders.filter(o => o.id !== orderId));

                setOrderStatus({
                    isSubmitting: false,
                    isSuccess: true,
                    error: null
                });

                setTimeout(() => {
                    setOrderStatus({
                        isSubmitting: false,
                        isSuccess: null,
                        error: null
                    });
                }, 3000);

                setIsCancelling(false);
                return true;
            } else {
                throw new Error("RSI 주문 취소 실패");
            }
        } catch (error) {
            console.error("RSI 주문 취소 오류:", error);
            setOrderStatus({
                isSubmitting: false,
                isSuccess: false,
                error: error instanceof Error ? error.message : "RSI 주문 취소 중 오류가 발생했습니다."
            });
            
            setIsCancelling(false);
            return false;
        }
    }, [pendingOrders]);

    const submitRSITrade = useCallback(async (userId: string, coinName: string, cash: string) => {
        if(!coinName || !cash || cash === "0"){
            setOrderStatus({
                isSubmitting: false,
                isSuccess: false,
                error: "코인과 매수 금액을 확인해주세요"
            });
            return false;
        }

        setOrderStatus({
            isSubmitting: true,
            isSuccess: null,
            error: null
        });

        try {
            const cleanCash = cash.replace(/,/g, '');
            
            // 최소 주문 금액 검증 추가
            if(parseInt(cleanCash) < 7200) {
                throw new Error("최소 주문 금액은 7200원 입니다.");
            }

            // 요청 타임아웃 설정 
            const success = await Promise.race([
                submitMarketTAOrder(
                    userId,
                    coinName,
                    cleanCash,
                    rsiParams.rsi,
                    rsiParams.state,
                    rsiParams.intervals
                ),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error("요청 시간 초과")), 10000)
                )
            ]) as boolean;
            
            if(success){
                const newOrder: RSIPendingOrder = {
                    id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                    userId: userId,
                    coinName,
                    cash: cleanCash,
                    rsi: rsiParams.rsi,
                    state: rsiParams.state,
                    intervals: rsiParams.intervals,
                    timestamp: Date.now()
                };

                setPendingOrders(prevOrders => [...prevOrders, newOrder]);

                setOrderStatus({
                    isSubmitting: false,
                    isSuccess: true,
                    error: null
                });
                return true;
            } else {
                throw new Error("RSI 주문 처리 실패");
            }
        } catch (error) {
            console.error("RSI 주문 처리 오류:", error);
            setOrderStatus({
                isSubmitting: false,
                isSuccess: false,
                error: error instanceof Error ? error.message : "RSI 주문 처리 중 오류가 발생했습니다."
            });
            return false;
        }
    }, [rsiParams]);

    const resetOrderStatus = useCallback(() => {
        setOrderStatus({
            isSubmitting: false,
            isSuccess: null,
            error: null
        })
    }, []);

    return {
        rsiParams,
        orderStatus,
        setRSIValue,
        setInterval,
        submitRSITrade,
        resetOrderStatus,
        updateRSIParams,
        setTradeState,
        pendingOrders,
        cancleRSIOrder,
        isCancelling
    };
}
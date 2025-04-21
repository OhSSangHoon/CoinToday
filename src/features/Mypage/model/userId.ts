import { useState, useEffect } from 'react';

// shared/userId.ts는 session는 실시간으로 업데이트되지 않아 사용하기 어려움
// 그래서 이 파일을 사용하여 실시간으로 업데이트되는 userId를 사용할 수 있도록 함

export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);
  const [nickName, setNickName] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    const storedNickName = sessionStorage.getItem('nickName');
    
    if (storedUserId) {
      setUserId(storedUserId);
    }
    if (storedNickName) {
      setNickName(storedNickName);
    }
  }, []);

  return { userId, nickName };
}
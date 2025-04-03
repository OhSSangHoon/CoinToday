import React, { useState } from "react";
import { LoginApi } from "../api";

export default function useLogin() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 에러 메시지 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 중에는 버튼을 비활성화하고 로딩 상태 처리
    setIsLoading(true);

    try {
      const response = await LoginApi(userId, password);
      sessionStorage.setItem("userId", response.data.userId);
      sessionStorage.setItem("nickName", response.data.nickName);
      window.location.href = "/";
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setError("아이디 또는 비밀번호가 틀렸습니다.");
      } else {
        setError("로그인 실패. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return {
    handleLogin,
    isLoading,
    setUserId,
    setPassword,
    error,
    userId,
    password,
  };
}

import React, { useState } from "react";
import axios from "axios";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 에러 메시지 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 로그인 중에는 버튼을 비활성화하고 로딩 상태 처리
    setIsLoading(true);

    try {
      const response = await axios.post("http://116.126.197.110:30010/login", {
        userId,
        password,
      });

      // 로그인 성공 시 세션에 사용자 정보 저장
      if (response.status === 200) {
        sessionStorage.setItem("userId", response.data.userId);
        sessionStorage.setItem("nickName", response.data.nickName);

        // 로그인 성공 후 리디렉션하거나 성공 메시지 처리
        window.location.href = "/dashboard"; // 로그인 성공 후 대시보드로 이동
      }
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md w-80 text-black">
        <h2 className="text-2xl font-bold text-center mb-4">로그인</h2>

        <form onSubmit={handleLogin} className="w-full">
          {/* 사용자 ID 입력 */}
          <input
            className="w-full p-2 mb-2 border rounded"
            type="text"
            placeholder="사용자 ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />

          {/* 비밀번호 입력 */}
          <input
            className="w-full p-2 mb-2 border rounded"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full p-2 mb-2 border border-black rounded hover:bg-blue-600"
            disabled={isLoading} // 로딩 중에는 버튼 비활성화
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>

          {/* 로그인 실패 시 에러 메시지 출력 */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
}

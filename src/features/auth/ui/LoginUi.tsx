import { Link } from "react-router-dom";
import { useLogin } from "../model";

export default function LoginUI() {
  const {
    handleLogin,
    isLoading,
    setUserId,
    setPassword,
    error,
    userId,
    password,
  } = useLogin();

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

        <div className="flex flex-row gap-2 justify-center">
          <Link to="/join" className="hover:scale-110">
            회원가입
          </Link>
          |
          <Link to="/" className="hover:scale-110">
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}

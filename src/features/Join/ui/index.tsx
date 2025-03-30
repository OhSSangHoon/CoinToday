// ui/JoinUi.tsx
import useSignup from "../model/index";

export default function JoinUi() {
  const {
    register,
    handleSubmit,
    errors,
    signUp,
    requestEmailCode,
    verifyEmailCode,
    isLoading,
    successMessage,
  } = useSignup();

  // 폼 제출 처리
  const onSubmit = (data: any) => {
    signUp(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md w-80 text-black">
        <h2 className="text-2xl font-bold text-center mb-4">회원가입</h2>

        {/* 사용자 ID */}
        <input
          className="w-full p-2 mb-2 border rounded"
          placeholder="사용자 ID"
          {...register("userId")}
        />
        <div className="w-full h-10">
          {errors.userId && (
            <p className="text-red-500 text-sm">{errors.userId.message}</p>
          )}
        </div>

        {/* 닉네임 */}
        <input
          className="w-full p-2 mb-2 border rounded"
          placeholder="닉네임"
          {...register("nickName")}
        />
        <div className="w-full h-10">
          {errors.nickName && (
            <p className="text-red-500 text-sm">{errors.nickName.message}</p>
          )}
        </div>

        {/* 이메일 */}
        <input
          className="w-full p-2 mb-2 border rounded"
          type="email"
          placeholder="이메일"
          {...register("email")}
        />
        <div className="w-full h-10">
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
          {successMessage && successMessage.email}
        </div>

        {/* 이메일 인증 버튼 */}
        <button
          className="w-full p-2 mb-2 border border-black rounded hover:bg-blue-600"
          onClick={() => requestEmailCode("email")}
          disabled={isLoading}
        >
          이메일 인증
        </button>

        {/* 인증번호 입력 */}
        <input
          className="w-full p-2 mb-2 border rounded"
          placeholder="인증번호"
          {...register("authCode")}
        />
        <div className="w-full h-10">
          {errors.authCode && (
            <p className="text-red-500 text-sm">{errors.authCode.message}</p>
          )}
          {successMessage && successMessage.authCode}
        </div>

        {/* 인증하기 버튼 */}
        <button
          className="w-full p-2 mb-2 rounded border border-black hover:bg-green-600"
          onClick={() => verifyEmailCode("email", "authCode")}
        >
          인증하기
        </button>

        {/* 비밀번호 */}
        <input
          className="w-full p-2 mb-2 border rounded"
          type="password"
          placeholder="비밀번호"
          {...register("password")}
        />
        <div className="w-full h-10">
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <input
          className="w-full p-2 mb-2 border rounded"
          type="password"
          placeholder="비밀번호 확인"
          {...register("passwordConfirm")}
        />
        <div className="w-full h-10">
          {errors.passwordConfirm && (
            <p className="text-red-500 text-sm">
              {errors.passwordConfirm.message}
            </p>
          )}
        </div>

        {/* 빗썸 API 키 */}
        <input
          className="w-full p-2 mb-2 border rounded"
          placeholder="빗썸 API 키"
          {...register("apiKey")}
        />
        <div className="w-full h-10">
          {errors.apiKey && (
            <p className="text-red-500 text-sm">{errors.apiKey.message}</p>
          )}
        </div>
        {/* 빗썸 SEC 키 */}
        <input
          className="w-full p-2 mb-4 border rounded"
          placeholder="빗썸 SEC 키"
          {...register("secKey")}
        />
        <div className="w-full h-10">
          {errors.secKey && (
            <p className="text-red-500 text-sm">{errors.secKey.message}</p>
          )}
        </div>

        {/* 회원가입 버튼 */}
        <button
          className="w-full p-2 border border-black rounded hover:bg-purple-600"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? "가입 중..." : "회원가입"}
        </button>
      </div>
    </div>
  );
}

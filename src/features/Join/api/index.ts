import axios from "axios";

// 회원가입 API 호출
export const signUpApi = async (data: {
  userId: string;
  password: string;
  nickName: string;
  apiKey: string;
  secKey: string;
}) => {
  const response = await axios.post(
    "http://116.126.197.110:30010/sign-up",
    data
  );
  return response.data;
};

// 이메일 인증 코드 발급
export const requestEmailCodeApi = async (email: string) => {
  await axios.post("http://116.126.197.110:30010/email-get-code", {
    email: "kmk9970@naver.com",
  });
};

// 이메일 인증 코드 입력
export const verifyEmailCodeApi = async (email: string, authCode: string) => {
  const response = await axios.get(
    "http://116.126.197.110:30010/email-enter-code",
    {
      params: { email: "kmk9970@naver.com", code: 488372 },
    }
  );
  return response.data;
};

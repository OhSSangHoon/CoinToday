// model/useSignup.ts
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { requestEmailCodeApi, signUpApi, verifyEmailCodeApi } from "../api";

// 유효성 검사 스키마
// 에러메세지 (errors)는 yup에서 각 필드의 유효성 검사를 실패할 때 자동으로 반환
const signupSchema = yup.object().shape({
  userId: yup.string().required("사용자 ID는 필수입니다."),
  nickName: yup.string().required("닉네임은 필수입니다."),
  email: yup
    .string()
    .email("이메일 형식이 올바르지 않습니다.")
    .required("이메일은 필수입니다."),
  authCode: yup.string().required("인증번호는 필수입니다."),
  password: yup
    .string()
    .min(5, "비밀번호는 최소 5자 이상이어야 합니다.")
    .required("비밀번호는 필수입니다."),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다.")
    .required("비밀번호 확인은 필수입니다."),
  apiKey: yup.string().required("빗썸 API 키는 필수입니다."),
  secKey: yup.string().required("빗썸 SEC 키는 필수입니다."),
});

const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState({
    email: "",
    authCode: "",
  });

  // react-hook-form 훅 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    watch,
  } = useForm({
    resolver: yupResolver(signupSchema), // useForm 유효성 검사에 yup 스키마 사용
    mode: "onChange", // 실시간 검사 모드
  });

  // 이메일 인증 요청 함수
  const requestEmailCode = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await requestEmailCodeApi(email);
      console.log(response);
      setIsLoading(false);
      setSuccessMessage((prev) => ({
        ...prev,
        email: "이메일 인증 코드가 발송되었습니다.",
      }));
    } catch (error) {
      setIsLoading(false);
      setError("authCode", {
        type: "manual",
        message: "이메일 인증 코드 발송에 실패했습니다.",
      });
      // setError: yup을 제외한 수동 error설정. 필드-타입(수동)-메세지 형태
    }
  };

  // 이메일 인증 코드 검증 함수
  const verifyEmailCode = async (email: string, authCode: string) => {
    console.log(email, authCode);
    try {
      const response = await verifyEmailCodeApi(email, authCode);
      setSuccessMessage((prev) => ({
        ...prev,
        authCode: "인증에 성공하였습니다. ",
      }));
      return response;
    } catch (error) {
      console.log(error);
      setError("email", {
        type: "manual",
        message: "다시 시도하세요!",
      });
    }
  };

  // 회원가입 함수
  const signUp = async (data: any) => {
    try {
      setIsLoading(true);
      const responseData = await signUpApi(data);
      console.log(responseData);
    } catch (error) {
      setIsLoading(false);
      setError("userId", {
        type: "manual",
        message: "회원가입에 실패했습니다.",
      });
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    signUp,
    requestEmailCode,
    verifyEmailCode,
    setValue,
    isLoading,
    successMessage,
    watch,
  };
};

export default useSignup;

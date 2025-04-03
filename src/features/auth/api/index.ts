import axios from "axios";

export const LoginApi = async (userId: string, password: string) => {
  const response = await axios.post("http://116.126.197.110:30010/login", {
    userId,
    password,
  });
  return response;
};

export const LogoutApi = async () => {
  const response = await axios.get("http://116.126.197.110:30010/logout");
  return response;
};

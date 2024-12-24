// api.js (Axios 공통 설정)
import axios from "axios";

const createAxiosInstance = () => {
  const token = localStorage.getItem("token");

  return axios.create({
    baseURL: "http://localhost:8080/api", // 기본 URL
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json", // 기본 헤더 설정
    },
    timeout: 10000, // 기본 타임아웃 설정 (10초)
  });
};

export default createAxiosInstance;

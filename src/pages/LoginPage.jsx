import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../config/AuthContext"; // AuthContext에서 useAuth 훅 가져오기
import axios from "axios";
import "../config/index.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // AuthContext에서 setIsLoggedIn 가져오기

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        username,
        password,
      });
      const { success, message, token } = response.data;
      if (success) {
        console.log("로그인 성공:", message);
        login(token); // 로그인 상태를 AuthContext에서 업데이트
        navigate("/dashboard"); // 대시보드로 이동
      } else {
        setError(message || "알 수 없는 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("로그인에 실패했습니다. 다시 시도하세요.");
      }
    } finally {
      setIsLoading(false); // 로딩 상태 비활성화
    }
  };

  return (
    <div className="detail-container">
      <h1 className="title">로그인</h1>
      <form onSubmit={handleLogin} className="form">
        <div className="form-group">
          <label htmlFor="username" className="label">
            ID :
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="label">
            PW :
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Loading..." : "로그인"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;

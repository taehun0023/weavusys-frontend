import React, { createContext, useContext, useState, useEffect } from "react";

// 로그인 상태와 관련된 데이터를 관리할 Context 생성
const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null); // token 상태 추가
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setIsLoggedIn(true);
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    const expirationTime = new Date().getTime() + 3600 * 1000; // 1시간 후
    localStorage.setItem("token", newToken); // 토큰 저장
    localStorage.setItem("expirationTime", expirationTime);
    setIsLoggedIn(true);
    setToken(newToken);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken(null);
    localStorage.removeItem("token"); // 토큰 삭제
    localStorage.removeItem("expirationTime"); // 만료 시간 삭제
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const expirationTime = localStorage.getItem("expirationTime");
      if (expirationTime) {
        const timeLeft = parseInt(expirationTime, 10) - new Date().getTime();
        if (timeLeft <= 0) {
          logout();
        } else {
          setTimeout(logout, timeLeft); // 남은 시간만큼 대기 후 로그아웃
        }
      }
    };

    checkTokenExpiration(); // 초기 확인

    return () => clearTimeout(); // 클린업
  }, []);

  if (loading) {
    return <div>Loading...</div>; // 초기화 중 로딩 상태 표시
  }

  return (
      <AuthContext.Provider value={{ isLoggedIn, token, login, logout }}>
        {children}
      </AuthContext.Provider>
  );
};

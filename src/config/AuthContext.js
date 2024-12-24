import React, { createContext, useContext, useState, useEffect } from "react";

// 로그인 상태와 관련된 데이터를 관리할 Context 생성
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null); // token 상태 추가

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setIsLoggedIn(true);
      setToken(savedToken);
    }
  }, []);

  const login = (newToken) => {
    setIsLoggedIn(true);
    setToken(newToken);
    localStorage.setItem("token", newToken); // 토큰 저장
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken(null);
    localStorage.removeItem("token"); // 토큰 삭제
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

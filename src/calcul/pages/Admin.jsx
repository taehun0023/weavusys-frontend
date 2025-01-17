import React, { useEffect, useState } from "react";
import "../../config/index.css";
import { getRankText, formatAmount } from "../../utils/textUtils";
import createAxiosInstance from "../../config/api";

const EmployeeSettings = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const axiosInstance = createAxiosInstance(); // 인스턴스 생성
        const response = await axiosInstance.get("/employees/admin/setting");
        setEmployees(response.data);
        setLoading(false);
      } catch (err) {
        setError("유저 정보를 불러오지 못했습니다.");
        setLoading(false);
        console.error(err); // 에러 로깅
      }
    };
    fetchEmployee();
  }, []);

  const handleAmountChange = (index, value) => {
    const updatedEmployees = [...employees];
    const numericValue = value.replace(/[^0-9]/g, "");
    updatedEmployees[index].monthlyAmount = Number(numericValue);
    setEmployees(updatedEmployees);
  };

  const handleSave = async () => {
    try {
      const axiosInstance = createAxiosInstance(); // 인스턴스 생성
      await axiosInstance.put("/employees/admin/setting", employees);
      alert("적립금이 업데이트 되었습니다.");
    } catch (err) {
      alert("다시 한번 확인해 주세요. " + err.message);
    }
  };

  // 관리자 계정 저장하는 프로세스 생성
  // 주소는 /api/signup
    // POST 방식으로 데이터를 보내면 됨
    // 데이터는 { username, password } 형식으로 보내면 됨
    // 성공하면 200, 실패하면 400을 반환함
  const adminSignUp = async () => {
    try {
      const axiosInstance = createAxiosInstance(); // 인스턴스 생성
      const response2 = await axiosInstance.post("/signup", {
        username,
        password,
      });
      const {message} = response2.data;
      alert(message);
      setPassword("");
        setUsername("");
    } catch (err) {
      alert("다시 한번 확인해 주세요. " + err.message);
    }
  }


  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div >
      <h1 className="title">WEAVUS 관리자 페이지</h1>
      <div className="detail-container">
        <table className="table">
          <thead>
          <tr>
            <th className="table-header">직급</th>
            <th className="table-header">현재 월 적립 금액</th>
          </tr>
          </thead>
          <tbody>
          {employees.map((employee, index) => (
              <tr key={index}>
                <td className="table-data">{getRankText(employee.rank)}</td>
                <td className="table-data">
                  <input
                      type="text"
                      className="input"
                      value={formatAmount(employee.monthlyAmount)}
                      onChange={(e) => handleAmountChange(index, e.target.value)}
                  />
                </td>
              </tr>
          ))}
          </tbody>
        </table>
        <button className="save-button" onClick={handleSave}>
          적립금 {""}
          업데이트
        </button>
      </div>
      <div className="detail-container">
            <h2>관리자 계정 생성</h2>
          <label htmlFor="username" className="label">
            ID :
          </label>
            <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="아이디"
            className="input"
            required
            />
          <label htmlFor="password" className="label">
            PW :
          </label>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="input"
            required
            />
            <button className="save-button" onClick={adminSignUp}>생성</button>
          </div>
    </div>
  );
}

export default EmployeeSettings;

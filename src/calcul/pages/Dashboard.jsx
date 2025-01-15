import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getStateText,
  getEmployeeTypeText,
  formatAmount,
} from "../../utils/textUtils";
import "../../config/index.css";

import { useFetchAccual } from "../utils/useFetchAccual"; // 유저 정보 요청 훅
import { useFetchYearData } from "../utils/useFetchYearData"; // 연도별 데이터 요청 훅

function Dashboard() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { userData, userError, userLoading } = useFetchAccual(); // 유저 정보 호출
  const { error, loading, totalAccumulatedAmount, fetchDataByYear } =
    useFetchYearData(selectedYear); // 연도별 데이터 호출

  const handleEmployeeClick = (employeeId) => {
    navigate(`/dashboard/${employeeId}`); // 상세 페이지로 이동
  };

  const handleChangeYear = (event) => {
    setSelectedYear(event.target.value); // 연도 변경 시 상태 업데이트
  };

  const handleSearchClick = () => {
    fetchDataByYear(selectedYear); // 연도에 맞는 데이터 요청
  };

  // 유저 정보와 연도별 데이터가 로딩되거나 에러가 발생한 경우 처리
  if (userLoading) {
    // || loading
    return <div className="loading">Loading...</div>;
  }

  if (userError || loading) {
    return <div className="error">{userError || error}</div>;
  }

  return (
    <div className="container">
      <h1 className="title">WEAVUS 퇴직금 목록</h1>
      <h3 className="title">연도별 적립 총액</h3>
      <div className="year-container">
        <label htmlFor="year" className="label">
          연도 선택:
        </label>
        <input
            id="year"
            type="number"
            value={selectedYear}
            onChange={handleChangeYear}
            min="1111"
            max="9999"
            // className="input"
        />
        <button className="submit-button" onClick={handleSearchClick}>
          검색
        </button>
      </div>
      <p className="total-amount">
        {selectedYear} 년의 적립 총액: {formatAmount(totalAccumulatedAmount)}
      </p>
      <table className="table">
        <thead>
          <tr>
            <th className="table-header">이름</th>
            <th className="table-header">계약 상태</th>
            <th className="table-header">입사일</th>
            <th className="table-header">퇴사일</th>
            <th className="table-header">적립 금액</th>
            <th className="table-header">지급 상태</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((item) => (
            <tr key={item.id}>
              <td className="table-data">
                <button
                  className="action-button"
                  onClick={() => handleEmployeeClick(item.employee.id)}
                >
                  {item.employee.name}
                </button>
              </td>
              <td className="table-data">
                {getEmployeeTypeText(
                  item.employee.employeeType,
                  item.employee.status,
                    item.employee.exitDate
                )}
              </td>
              <td className="table-data">{item.employee.entryDate}</td>
              <td className="table-data">
                {item.employee.exitDate ? item.employee.exitDate : "재직중"}
              </td>
              <td className="table-data">
                {formatAmount(item.totalAmount ? item.totalAmount : "0")}
              </td>
              <td className="table-data">{getStateText(item.state)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;

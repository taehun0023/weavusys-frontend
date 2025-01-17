import React from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeeTypeText } from "../../utils/textUtils";
import { useState, useEffect } from "react";
import "../../config/index.css";
import createAxiosInstance from "../../config/api";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (isFetched) return; // 이미 호출된 경우 중단

      setLoading(true); // 로딩 시작

      try {
        const axiosInstance = createAxiosInstance(); // 인스턴스 생성
        const response = await axiosInstance.get("/employees/lists");
        if (Array.isArray(response.data)) {
          setData(response.data);
        } else {
          setError("서버에서 받은 데이터 형식이 올바르지 않습니다.");
        }
        setIsFetched(true); // 데이터 로드 완료
      } catch (error) {
        if (error.response) {
          console.error(
            "서버 에러:",
            error.response.status,
            error.response.data
          );
          setError("서버 오류가 발생했습니다.");
        } else if (error.request) {
          console.error("응답 없음:", error.request);
          setError("서버로부터 응답이 없습니다.");
        } else {
          console.error("요청 설정 에러:", error.message);
          setError("요청에 문제가 발생했습니다.");
        }
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchData();
  }, [isFetched]);

  const handleRowClick = () => {
    navigate(`/employee/new`);
  };

  const handleEmployeeClick = (employeeId) => {
    navigate(`/employee/${employeeId}`); // 상세 페이지로 이동
  };

  return (
    <div className="container">
      <h1 className="title">WEAVUS 사원 일람 리스트</h1>
      <button className="submit-button" onClick={() => handleRowClick()}>
        사원 등록
      </button>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && (
        <table className="table">
          <thead>
            <tr>
              <th className="table-header">이름</th>
              <th className="table-header">입사일</th>
              <th className="table-header">계약 상태</th>
            </tr>
          </thead>
          <tbody>
            {data.map((employee) => (
              <tr key={employee.id}>
                <td className="table-data">
                  <button
                    className="action-button"
                    onClick={() => handleEmployeeClick(employee.id)} // 클릭 시 handleEmployeeClick 함수 호출
                  >
                    {employee.name}
                  </button>
                </td>
                <td className="table-data">{employee.entryDate}</td>
                <td className="table-data">
                  {getEmployeeTypeText(employee.employeeType, employee.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmployeeDashboard;

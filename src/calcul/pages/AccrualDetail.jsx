import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../config/index.css";
import createAxiosInstance from "../../config/api";

import {
  getRankText,
  getEmployeeTypeText,
  getStateText,
  formatAmount,
} from "../../utils/textUtils";

const EmployeeDetailPage = () => {
  const { employeeId } = useParams(); // URL에서 employeeId 가져오기
  const [item, setItem] = useState(null); // 유저 정보 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // 서버에서 유저 상세 정보 가져오기
    const fetchEmployee = async () => {
      try {
        const axiosInstance = createAxiosInstance(); // 인스턴스 생성
        const response = await axiosInstance.get(
          `/employees/${employeeId}/accrual`
        );
        setItem(response.data);
      } catch (err) {
        setError("유저 정보를 불러오지 못했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  if (loading) return <loading className="loading">Loading...</loading>;
  if (error) return <error className="error">{error}</error>;

  return (
    <div className="detail-container">
      <h2>{item.employee.name} 의 퇴직금 상세정보</h2>
      {item ? (
        <div className="detailsTable">
          <div className="tablerow">
            <div className="cell-left">이름</div>
            <div className="cell-right">{item.employee.name}</div>
          </div>
          <div className="tablerow">
            <div className="cell-left">계약 상태</div>
            <div className="cell-right">
              {getEmployeeTypeText(
                item.employee.employeeType,
                item.employee.status
              )}
            </div>
          </div>
          <div className="tablerow">
            <div className="cell-left">직책</div>
            <div className="cell-right">{getRankText(item.employee.rank)}</div>
          </div>
          <div className="tablerow">
            <div className="cell-left">지급 상태</div>
            <div className="cell-right">{getStateText(item.state)}</div>
          </div>
          <div className="tablerow">
            <div className="cell-left">정직원 전환 일</div>
            <div className="cell-right">{item.employee.conversionDate}</div>
          </div>
          <div className="tablerow">
            <div className="cell-left">예상 퇴직금</div>
            <div className="cell-right">
              {formatAmount(item.totalAmount ? item.totalAmount : "0")}
            </div>
          </div>
          <div className="tablerow">
            <div className="cell-left">퇴사일</div>
            <div className="cell-right">
              {item.employee.exitDate ? item.employee.exitDate : "재직중"}
            </div>
          </div>
        </div>
      ) : (
        <p>유저 정보를 찾을 수 없습니다.</p>
      )}
    </div>
  );
};

export default EmployeeDetailPage;

// Styled Components
// const Container = styled.div`
//   padding: 2rem;
//   max-width: 700px;
//   margin: 0 auto;
// `;

// const Title = styled.h1`
//   font-size: 2rem;
//   margin-bottom: 1.5rem;
//   text-align: center;
// `;

// const DetailsTable = styled.div`
//   display: table;
//   width: 100%;
//   border-collapse: collapse;
//   background-color: #f9f9f9;
//   border: 1px solid #ddd;
// `;

// const Row = styled.div`
//   display: table-row;
// `;
// const CellLeft = styled.div`
//   display: table-cell;
//   padding: 0.8rem 1rem;
//   background-color: #f0f0f0;
//   font-weight: bold;
//   border: 1px solid #ddd;
//   text-align: left;
// `;

// const CellRight = styled.div`
//   display: table-cell;
//   padding: 0.8rem 1rem;
//   border: 1px solid #ddd;
//   text-align: left;
// `;

// const Loading = styled.div`
//   text-align: center;
//   font-size: 1.5rem;
//   margin-top: 2rem;
// `;

// const Error = styled.div`
//   color: red;
//   text-align: center;
//   font-size: 1.2rem;
//   margin-top: 2rem;
// `;

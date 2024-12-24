// src/utils/textUtils.js

// 상태 코드에 따른 텍스트 반환
export const getStateText = (state) => {
  switch (state) {
    case 0:
      return "지급 불가능";
    case 1:
      return "지급 가능";
    case 2:
      return "지급 완료";
    default:
      return "알 수 없음";
  }
};

// 직원 유형에 따른 텍스트 반환
export const getEmployeeTypeText = (employeeType, status) => {
  if (status == 0) {
    switch (employeeType) {
      case "CONTRACT":
        return "계약직";
      case "REGULAR":
        return "정직원";
      default:
        return "알 수 없음";
    }
  } else {
    return "퇴사자";
  }
};

//직원 직급에 따른 텍스트 반환
export const getRankText = (rank) => {
  switch (rank) {
    case 0:
      return "사원";
    case 1:
      return "주임";
    case 2:
      return "계장";
    case 3:
      return "부장";
    case 4:
      return "사장";
    default:
      return "알 수 없음";
  }
};

export const formatAmount = (amount) => {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  }).format(amount);
};

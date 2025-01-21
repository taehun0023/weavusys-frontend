import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import createAxiosInstance from "../../config/api";
import "../../config/index.css";
import {InstitutionListApi} from "../utils/InstitutionListApi";

function PersonnelDetail() {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState({});
  const { loadList, institutionList, instloading, insterror } = InstitutionListApi();

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const axiosInstance = createAxiosInstance(); // 인스턴스 생성
        const response = await axiosInstance.get(`/personnel/applicant/${Id}`);
        setItem(response.data);
        setEditedItem(response.data);
      } catch (err) {
        setError("지원자 정보를 불러오지 못했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnel();
  }, [Id]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault(); // 폼 제출 방지
    const confirmSave = window.confirm("해당 지원자를 수정하시겠습니까?");
    if (!confirmSave) {
      return;
    } else {
      try {
        const axiosInstance = createAxiosInstance(); // 인스턴스 생성
        const response = await axiosInstance.put(
          `/personnel/applicant/${Id}`,
          editedItem
        );
        setItem(response.data);
        setIsEditing(false);
        window.alert("지원자 정보를 수정하였습니다");
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // 404 에러에 대한 처리
          window.alert("입력된 값을 다시 한번 확인해 주세요");
        } else {
          // 기타 에러에 대한 처리
          setError("지원자 정보를 수정하는 데 실패했습니다.");
        }
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // 지원자 삭제 시 퇴직일 여부 판단하여 삭제 진행
  const handleDelete = async (id) => {
      const confirmDelete = window.confirm("직원을 삭제하시겠습니까?");
      if (!confirmDelete) return;
    try {
      const axiosInstance = createAxiosInstance(); // 인스턴스 생성
      const response = await axiosInstance.delete(
          `/personnel/applicant/${id}`
      );
      if (response.status === 200) {
        alert("지원자가 성공적으로 삭제되었습니다.");
        navigate("/personnel/dashboard"); // 삭제 후 지원자 목록 페이지로 이동
      } else if (response.status === 404) {
        alert("해당 지원자는 존재하지 않습니다.");
      }
    } catch (err) {
      alert("지원자 삭제에 실패했습니다.");
      console.error(err);
    }
  };

  if (loading) return <p style={styles.errorMessage}>Loading...</p>;
  if (error) return <p style={styles.errorMessage}>{error}</p>;

  return (
    <div className="detail-container">
      {item && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3>지원자 {item.name} 의 상세정보</h3>
          </div>
          <div style={styles.cardBody}>
            {isEditing ? (
              <div>
                <div>
                  <input
                    style={styles.input}
                    name="id"
                    value={editedItem.id}
                    onChange={handleChange}
                    disabled
                    hidden
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>지원자 이름</label>
                  <input
                    style={styles.input}
                    name="name"
                    value={editedItem.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>성별</label>
                  <select
                      style={styles.input}
                      name="gender"
                      value={editedItem.gender}
                      onChange={handleChange}
                      className="input"
                      required
                  >
                    <option value="" disabled>
                      성별을 선택해 주세요
                    </option>
                    <option value="남성">남성</option>
                    <option value="여성">여성</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>email</label>
                  <input
                    style={styles.input}
                    type="email"
                    name="email"
                    value={editedItem.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>생년월일</label>
                  <input
                      type="date"
                      style={styles.input}
                    name="birthDate"
                    value={editedItem.birthDate || ""}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>전화번호</label>
                      <input
                          type="tel"
                          style={styles.input}
                          name="phoneNumber"
                          value={editedItem.phoneNumber}
                          onChange={handleChange}
                          className="input"
                      />
                    </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>소속 기관</label>
                  <select
                      style={styles.input}
                      name="institutionId"
                      value={editedItem.institutionId || ""}
                      onChange={handleChange}
                      className="input"
                      required
                  >
                    <option value="" disabled>
                      소속 기관을 선택해 주세요
                    </option>
                    {institutionList && institutionList.length > 0 ? (
                        institutionList.map((institution) => (
                            <option key={institution.id} value={institution.id}>
                              {institution.name}
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>
                          Loading...
                        </option>
                    )}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>지원 날짜</label>
                  <input
                      type="date"
                      style={styles.input}
                    name="joiningDate"
                    value={editedItem.joiningDate || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            ) : (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>지원자 이름</label>
                  <div style={styles.box}>
                    <p>{item.name}</p>
                  </div>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>성별</label>
                    <div style={styles.box}>
                      <p>{item.gender}</p>
                    </div>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>email</label>
                    <div style={styles.box}>
                        <p>{item.email}</p>
                    </div>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>생년월일</label>
                    <div style={styles.box}>
                        <p>{item.birthDate}</p>
                    </div>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>전화번호</label>
                    <div style={styles.box}>
                        <p>{item.phoneNumber}</p>
                    </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>소속 기관</label>
                  <div style={styles.box}>
                    <p>{item.institution.name}</p>
                  </div>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>지원 날짜</label>
                    <div style={styles.box}>
                        <p>{item.joiningDate}</p>
                    </div>
                </div>
              </>
            )}
          </div>
          <div style={styles.cardFooter}>
            {isEditing ? (
                <button style={styles.actionButton} onClick={handleSave}>
                  저장
                </button>
            ) : (
              <button style={styles.actionButton} onClick={handleEditClick}>
                수정
              </button>
            )}
            {!isEditing && (
              <button
                style={{ ...styles.actionButton, ...styles.actionButtonDanger }}
                onClick={() => handleDelete(item.id)}
              >
                삭제
              </button>
            )}
            <button style={styles.actionButton} onClick={handleGoBack}>
              돌아가기
            </button>
          </div>
        </div>
      )}
    </div>

  );
}

const styles = {
  container: {
    padding: "20px",
    max_width: "600px",
    margin: "0 auto",
    background: "#f9f9f9",
  },
  card: {
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: "4px",
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px",
  },
  cardBody: {
    padding: "20px",
  },
  cardFooter: {
    padding: "10px",
    textAlign: "right",
    borderTop: "1px solid #ddd",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    fontWeight: "bold",
    display: "block",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "8px",
    boxSizing: "border-box",
  },
  box: {
    padding: "10px",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    margin: "20px",
  },
  actionButton: {
    padding: "8px 12px",
    margin: "0 5px",
    backgroundColor: "rgb(76, 175, 80)",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  actionButton2: {
    padding: "8px 12px",
    margin: "0 5px",
    backgroundColor: "rgb(76, 175, 80)",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "block",
    marginLeft: "auto"
  },
  actionButtonDanger: {
    backgroundColor: "rgb(76, 175, 80)",
  },
};

export default PersonnelDetail;

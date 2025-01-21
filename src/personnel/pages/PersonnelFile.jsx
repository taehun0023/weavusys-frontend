import React, { useState } from "react";
import axios from "axios";

const FileUploadDownload = ({ applicantId }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0); // 업로드 진행 상태
  const [downloading, setDownloading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 3) {
      alert("최대 3개의 파일만 업로드할 수 있습니다.");
      return;
    }
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index + 1}`, file);
    });

    setUploading(true);
    setProgress(0); // 초기화

    try {
      await axios.post(`/applicant/${applicantId}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });
      alert("파일 업로드 성공!");
      setFiles([]); // 업로드 성공 후 파일 초기화
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      alert("파일 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
      setProgress(0); // 업로드 완료 후 초기화
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await axios.get(`/applicant/${applicantId}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "files.zip"); // 압축 파일로 가정
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("파일 다운로드 실패:", error);
      alert("파일 다운로드 중 오류가 발생했습니다.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="file-upload-download-container">
      <h3>파일 업로드 및 다운로드</h3>
      <div>
        <label htmlFor="file-upload" style={{ display: "block", marginBottom: "10px" }}>
          파일 선택 (최대 3개)
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          accept=".jpg,.png,.pdf,.zip" // 필요에 따라 확장자 제한
          onChange={handleFileChange}
        />
        <div style={{ marginTop: "10px" }}>
          {files.length > 0 &&
            files.map((file, index) => <p key={index}>{file.name}</p>)}
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        {uploading && (
          <div style={{ marginBottom: "10px" }}>
            <p>업로드 진행 중: {progress}%</p>
            <div
              style={{
                width: "100%",
                backgroundColor: "#e0e0e0",
                borderRadius: "5px",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  backgroundColor: "#4caf50",
                  height: "10px",
                  borderRadius: "5px",
                }}
              ></div>
            </div>
          </div>
        )}
        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          style={{
            marginRight: "10px",
            backgroundColor: uploading ? "#ccc" : "#4caf50",
            color: "#fff",
            padding: "10px 15px",
            border: "none",
            cursor: uploading ? "not-allowed" : "pointer",
          }}
        >
          {uploading ? "업로드 중..." : "업로드"}
        </button>
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            backgroundColor: downloading ? "#ccc" : "#2196f3",
            color: "#fff",
            padding: "10px 15px",
            border: "none",
            cursor: downloading ? "not-allowed" : "pointer",
          }}
        >
          {downloading ? "다운로드 중..." : "다운로드"}
        </button>
      </div>
    </div>
  );
};

export default FileUploadDownload;

import React from "react";
import {
    HashRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./config/AuthContext";
import LoginPage from "./mainpages/LoginPage";
import Dashboard from "./calcul/pages/Dashboard";
import Navbar from "./config/Navbar";
import AccrualDetail from "./calcul/pages/AccrualDetail";
import Admin from "./calcul/pages/Admin";
import EmployeeDashboard from "./calcul/pages/EmployeeDashboard";
import EmployeeRegi from "./calcul/pages/EmployeeRegi";
import EmployeeDetail from "./calcul/pages/EmployeeDetail";
import {useEffect} from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import PersonnelDashboard from "./personnel/pages/PersonnelDashboard";
const Layout = ({ children }) => (
    <>
        <Navbar />
        <div style={{ marginTop: "100px", padding: "0px" }}>{children}</div>
    </>
);

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? children : <Navigate to="/" />;
};

const App = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const location = useLocation();

    useEffect(() => {
        // 새로고침 후 로그인 상태 확인
        if (isLoggedIn && location.pathname === "/#/") {
            navigate('/dashboard'); // 로그인 상태에서 "/"에 있을 경우에만 리다이렉트
        } else if (!isLoggedIn && location.pathname !== "/#/") {
            navigate('/'); // 로그인되지 않은 사용자가 다른 경로로 접근할 경우 리다이렉트
        }
    }, [isLoggedIn, navigate, location.pathname ]);

    return(
        <Layout>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/:employeeId"
                    element={
                        <ProtectedRoute>
                            <AccrualDetail />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <Admin />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employee"
                    element={
                        <ProtectedRoute>
                            <EmployeeDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employee/new"
                    element={
                        <ProtectedRoute>
                            <EmployeeRegi />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employee/:employeeId"
                    element={
                        <ProtectedRoute>
                            <EmployeeDetail />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/personel/dashboard"
                    element={
                        <ProtectedRoute>
                            <PersonnelDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Layout>
    );
};

const Root = () => (
    <AuthProvider>
        <Router>
            <App />
        </Router>
    </AuthProvider>
);

export default Root;

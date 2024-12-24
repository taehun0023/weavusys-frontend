import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./config/AuthContext";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Navbar from "./config/Navbar";
import AccrualDetail from "./pages/AccrualDetail";
import Admin from "./pages/Admin";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeRegi from "./pages/EmployeeRegi";
import EmployeeDetail from "./pages/EmployeeDetail";

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

const App = () => (
  <Router>
    <AuthProvider>
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
        </Routes>
      </Layout>
    </AuthProvider>
  </Router>
);

export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserDetails from "../pages/UserDetails";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Audit from "../pages/Audit";
import NewAudit from "../pages/NewAudit";
import Users from "../pages/Users";
import NewUser from "../pages/NewUser";
import EditUser from "../pages/EditUser";
import Reports from "../pages/Reports";
import Notifications from "../pages/Notifications";
import AuditDetails from "../pages/AuditDetails";
import Rules from "../pages/Rules";
import NewRule from "../pages/NewRule";
import RuleDetails from "../pages/RuleDetails";
import Settings from "../pages/Settings";


function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Audits */}
        <Route
          path="/audits"
          element={
            <ProtectedRoute>
              <Audit />
            </ProtectedRoute>
          }
        />
        <Route
  path="/audits/new"
  element={
    <ProtectedRoute>
      <NewAudit />
    </ProtectedRoute>
  }
/>
<Route
  path="/users"
  element={
    <ProtectedRoute>
      <Users />
    </ProtectedRoute>
  }
/>
<Route
  path="/users/new"
  element={
    <ProtectedRoute>
      <NewUser />
    </ProtectedRoute>
  }
/>
<Route
  path="/users/:userId"
  element={
    <ProtectedRoute>
      <UserDetails />
    </ProtectedRoute>
  }
/>
<Route
  path="/users/:userId/edit"
  element={
    <ProtectedRoute>
      <EditUser />
    </ProtectedRoute>
  }
/>
<Route
  path="/reports"
  element={
    <ProtectedRoute>
      <Reports />
    </ProtectedRoute>
  }
/>
<Route
  path="/notifications"
  element={
    <ProtectedRoute>
      <Notifications />
    </ProtectedRoute>
  }
/>
<Route
  path="/audits/:auditId"
  element={
    <ProtectedRoute>
      <AuditDetails />
    </ProtectedRoute>
  }
/>
<Route
  path="/rules"
  element={
    <ProtectedRoute>
      <Rules />
    </ProtectedRoute>
  }
/>
<Route
  path="/rules/new"
  element={
    <ProtectedRoute>
      <NewRule />
    </ProtectedRoute>
  }
/>
<Route
  path="/rules/:ruleId"
  element={
    <ProtectedRoute>
      <RuleDetails />
    </ProtectedRoute>
  }
/>
<Route
  path="/settings"
  element={
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  }
/>
        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
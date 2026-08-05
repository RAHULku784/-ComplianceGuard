import {
  FaTachometerAlt,
  FaClipboardList,
  FaUsers,
  FaChartBar,
  FaBell,
  FaCog,
  FaShieldAlt,
  FaRobot,
  FaSignOutAlt,
  FaBook,
} from "react-icons/fa";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";


function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem("access_token");

    navigate("/login", {
      replace: true,
    });

  };


  // ==========================================
  // ACTIVE MENU
  // ==========================================

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };


  return (

    <aside className="sidebar">


      {/* =====================================
          LOGO
      ====================================== */}

      <div className="logo">

        <FaShieldAlt className="logo-icon" />

        <div>

          <h2>
            Compliance
          </h2>

          <span>
            Guard AI
          </span>

        </div>

      </div>


      {/* =====================================
          NAVIGATION
      ====================================== */}

      <ul className="menu">


        {/* Dashboard */}

        <li
          className={
            location.pathname === "/dashboard"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <FaTachometerAlt />

          <span>
            Dashboard
          </span>
        </li>


        {/* Audits */}

        <li
          className={
            isActive("/audits")
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("/audits")
          }
        >
          <FaClipboardList />

          <span>
            Audits
          </span>
        </li>


        {/* Compliance Rules */}

        <li
          className={
            isActive("/rules")
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("/rules")
          }
        >
          <FaBook />

          <span>
            Compliance Rules
          </span>
        </li>


        {/* Users */}

        <li
          className={
            isActive("/users")
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("/users")
          }
        >
          <FaUsers />

          <span>
            Users
          </span>
        </li>


        {/* Reports */}

        <li
          className={
            isActive("/reports")
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("/reports")
          }
        >
          <FaChartBar />

          <span>
            Reports
          </span>
        </li>


        {/* Notifications */}

        <li
          className={
            isActive("/notifications")
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("/notifications")
          }
        >
          <FaBell />

          <span>
            Notifications
          </span>
        </li>


        {/* AI Assistant */}

        <li
          className={
            isActive("/ai-assistant")
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("/ai-assistant")
          }
        >
          <FaRobot />

          <span>
            AI Assistant
          </span>
        </li>


        {/* Settings */}

        <li
          className={
            isActive("/settings")
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("/settings")
          }
        >
          <FaCog />

          <span>
            Settings
          </span>
        </li>


      </ul>


      {/* =====================================
          LOGOUT
      ====================================== */}

      <div
        className="logout"
        onClick={handleLogout}
        style={{
          cursor: "pointer",
        }}
      >
        <FaSignOutAlt />

        <span>
          Logout
        </span>
      </div>


    </aside>

  );

}


export default Sidebar;
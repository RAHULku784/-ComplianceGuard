import Sidebar from "../components/Sidebar";
import Charts from "../components/Charts";
import StatCard from "../components/StatCard";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AIAssistant from "../components/AIAssistant";

import {
  getDashboardSummary,
  getProfile,
  getNotifications,
} from "../services/api";

import {
  FaBell,
  FaPalette,
  FaUserCircle,
  FaCalendarAlt,
} from "react-icons/fa";

import { useTheme } from "../context/ThemeContext";


function Dashboard() {

  const navigate = useNavigate();

  // ==========================================
  // PROFILE
  // ==========================================

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    role_id: null,
  });


  // ==========================================
  // DASHBOARD DATA
  // ==========================================

  const [dashboardData, setDashboardData] = useState({
    total_users: 0,
    audits_completed: 0,
    compliance_score: 0,
    open_risks: 0,
  });


  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] =
    useState(true);

  const [showNotifications, setShowNotifications] =
    useState(false);


  // ==========================================
  // OTHER STATES
  // ==========================================

  const { changeTheme } = useTheme();

  const [showThemeMenu, setShowThemeMenu] =
    useState(false);

  const [showAI, setShowAI] =
    useState(false);

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);


  // ==========================================
  // REFS
  // ==========================================

  const notificationRef = useRef(null);
  const profileRef = useRef(null);


  // ==========================================
  // DATE + GREETING
  // ==========================================

  const today = new Date();

  const date = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hour = today.getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }


  // ==========================================
  // CLICK OUTSIDE
  // ==========================================

  useEffect(() => {

    function handleClickOutside(event) {

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);


  // ==========================================
  // FETCH DASHBOARD
  // ==========================================

  useEffect(() => {

    const fetchDashboardData = async () => {

      try {

        const data =
          await getDashboardSummary();

        setDashboardData(data);

      } catch (error) {

        console.error(
          "Dashboard API error:",
          error
        );

      }
    };

    fetchDashboardData();

  }, []);


  // ==========================================
  // FETCH PROFILE
  // ==========================================

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const data =
          await getProfile();

        setProfile(data);

      } catch (error) {

        console.error(
          "Profile API error:",
          error
        );

      }
    };

    fetchProfile();

  }, []);


  // ==========================================
  // FETCH NOTIFICATIONS
  // ==========================================

  useEffect(() => {

    const fetchNotifications = async () => {

      try {

        const data =
          await getNotifications();

        setNotifications(data);

      } catch (error) {

        console.error(
          "Notifications API error:",
          error
        );

      } finally {

        setNotificationsLoading(false);

      }
    };

    fetchNotifications();

  }, []);


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = (event) => {

    event.stopPropagation();

    localStorage.removeItem("access_token");

    setShowProfileMenu(false);

    navigate("/login", {
      replace: true,
    });
  };


  // ==========================================
  // ROLE NAME
  // ==========================================

  const getRoleName = (roleId) => {

    switch (roleId) {

      case 1:
        return "Admin";

      case 2:
        return "Compliance Officer";

      case 3:
        return "Auditor";

      case 4:
        return "Customer";

      default:
        return "User";
    }
  };


  // ==========================================
  // RETURN
  // ==========================================

  return (

    <div className="dashboard">

      <Sidebar />


      <div className="dashboard-content">


        {/* =====================================
            HEADER
        ====================================== */}

        <div className="dashboard-header">


          {/* Greeting */}

          <div>

            <h1>
              {greeting},{" "}
              {profile.full_name || "User"} 👋
            </h1>


            <p>

              <FaCalendarAlt
                style={{
                  marginRight: "8px",
                  color: "#60A5FA",
                }}
              />

              {date}

            </p>

          </div>


          {/* Header Actions */}

          <div className="header-actions">


            {/* =================================
                SEARCH
            ================================== */}

            <input
              type="text"
              placeholder="Search anything..."
              className="search-box"
            />


            {/* =================================
                REAL NOTIFICATIONS
            ================================== */}

            <div
              className="notification"
              ref={notificationRef}
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
            >

              <FaBell className="header-icon" />


              {/* Notification Badge */}

              {notifications.length > 0 && (

                <span className="notification-badge">

                  {notifications.length > 99
                    ? "99+"
                    : notifications.length}

                </span>

              )}


              {/* Notification Dropdown */}

              {showNotifications && (

                <div
                  className="notification-dropdown"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >


                  {/* Dropdown Header */}

                  <div className="dashboard-notification-header">

                    <div>

                      <h3>
                        Notifications
                      </h3>

                      <span>
                        {notifications.length} active{" "}
                        {notifications.length === 1
                          ? "alert"
                          : "alerts"}
                      </span>

                    </div>

                  </div>


                  {/* Loading */}

                  {notificationsLoading ? (

                    <div className="dashboard-notification-empty">

                      Loading notifications...

                    </div>

                  ) : notifications.length === 0 ? (

                    /* Empty */

                    <div className="dashboard-notification-empty">

                      No active notifications 🎉

                    </div>

                  ) : (

                    <>

                      {/* Show first 5 */}

                      {notifications
                        .slice(0, 5)
                        .map((item) => (

                          <div
                            className="notification-item"
                            key={item.id}
                            onClick={() => {
  setShowNotifications(false);

  navigate(
    `/audits/${item.check_id}`
  );
}}
                          >


                            {/* Type Dot */}

                            <div
                              className={
                                `dashboard-notification-dot ${item.type}`
                              }
                            />


                            {/* Notification Content */}

                            <div className="dashboard-notification-content">


                              <div className="dashboard-notification-title">

                                <strong>
                                  {item.title}
                                </strong>


                                <span
                                  className={
                                    `dashboard-notification-priority ${
                                      item.priority
                                        ?.toLowerCase()
                                    }`
                                  }
                                >

                                  {item.priority}

                                </span>

                              </div>


                              <p>
                                {item.message}
                              </p>


                              {item.due_date && (

                                <small>
                                  Due: {item.due_date}
                                </small>

                              )}

                            </div>

                          </div>

                        ))}


                      {/* View All */}

                      <button
                        type="button"
                        className="view-all-notifications"
                        onClick={() => {

                          setShowNotifications(false);

                          navigate(
                            "/notifications"
                          );

                        }}
                      >

                        View All Notifications

                      </button>

                    </>

                  )}

                </div>

              )}

            </div>


            {/* =================================
                THEME
            ================================== */}

            <div className="theme-selector">

              <FaPalette
                className="header-icon"
                onClick={() =>
                  setShowThemeMenu(
                    !showThemeMenu
                  )
                }
              />


              {showThemeMenu && (

                <div className="theme-menu">


                  <div
                    className="theme-option"
                    onClick={() => {

                      changeTheme("dark");

                      setShowThemeMenu(false);

                    }}
                  >
                    🌙 Dark
                  </div>


                  <div
                    className="theme-option"
                    onClick={() => {

                      changeTheme("light");

                      setShowThemeMenu(false);

                    }}
                  >
                    ☀️ Light
                  </div>


                  <div
                    className="theme-option"
                    onClick={() => {

                      changeTheme("midnight");

                      setShowThemeMenu(false);

                    }}
                  >
                    🌌 Blue Midnight
                  </div>


                </div>

              )}

            </div>


            {/* =================================
                PROFILE
            ================================== */}

            <div
              className="profile-section"
              ref={profileRef}
            >


              <div
                onClick={() =>
                  setShowProfileMenu(
                    (previous) => !previous
                  )
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >

                <FaUserCircle className="profile" />


                <div>

                  <h4>
                    {profile.full_name || "User"}
                  </h4>

                  <span>
                    {getRoleName(
                      profile.role_id
                    )}
                  </span>

                </div>

              </div>


              {/* Profile Dropdown */}

              {showProfileMenu && (

                <div
                  className="profile-dropdown"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >


                  <div className="dropdown-item">
                    👤 View Profile
                  </div>


                  <div className="dropdown-item">
                    ⚙ Account Settings
                  </div>


                  <div
                    className="dropdown-item"
                    onClick={() => {

                      setShowProfileMenu(false);

                      navigate(
                        "/notifications"
                      );

                    }}
                  >
                    🔔 Notifications
                  </div>


                  <div className="dropdown-item">
                    ☁ AWS Console
                  </div>


                  <div className="dropdown-item">
                    📊 DevOps Dashboard
                  </div>


                  <hr />


                  <div
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </div>


                </div>

              )}

            </div>


            {/* =================================
                AI ASSISTANT
            ================================== */}

            <button
              className="assistant-btn"
              onClick={() =>
                setShowAI(true)
              }
            >
              🤖 AI Assistant
            </button>


          </div>

        </div>


        {/* =====================================
            STATISTICS
        ====================================== */}

        <div className="stats-grid">


          <StatCard
            title="Total Users"
            value={
              dashboardData.total_users
            }
            subtitle="↑ 12.5% from last month"
            color="blue"
          />


          <StatCard
            title="Audits Completed"
            value={
              dashboardData.audits_completed
            }
            subtitle="↑ 8.3% from last month"
            color="green"
          />


          <StatCard
            title="Compliance Score"
            value={
              `${dashboardData.compliance_score}%`
            }
            subtitle="Excellent Performance"
            color="purple"
          />


          <StatCard
            title="Open Risks"
            value={
              dashboardData.open_risks
            }
            subtitle="Needs Attention"
            color="orange"
          />


        </div>


        {/* =====================================
            CHARTS
        ====================================== */}

        <Charts />


        {/* =====================================
            AI ASSISTANT
        ====================================== */}

        <AIAssistant
          isOpen={showAI}
          onClose={() =>
            setShowAI(false)
          }
        />


      </div>

    </div>

  );
}


export default Dashboard;
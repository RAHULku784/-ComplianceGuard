import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import { getNotifications } from "../services/api";

import {
  FaBell,
  FaExclamationTriangle,
  FaClock,
  FaShieldAlt,
  FaBuilding,
  FaCalendarAlt,
} from "react-icons/fa";


function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setError("");

        const data = await getNotifications();

        setNotifications(data);

      } catch (error) {
        console.error(
          "Notifications API error:",
          error
        );

        setError(
          "Unable to load notifications."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);


  const criticalCount = notifications.filter(
    (item) => item.priority === "Critical"
  ).length;

  const highCount = notifications.filter(
    (item) => item.priority === "High"
  ).length;

  const upcomingCount = notifications.filter(
    (item) => item.type === "upcoming"
  ).length;


  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter(
          (item) => item.type === filter
        );


  const getNotificationIcon = (type) => {
    if (type === "overdue") {
      return <FaExclamationTriangle />;
    }

    if (type === "risk") {
      return <FaShieldAlt />;
    }

    return <FaClock />;
  };


  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "No due date";
    }

    const date = new Date(
      `${dateValue}T00:00:00`
    );

    return date.toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };


  if (loading) {
    return (
      <div className="dashboard">

        <Sidebar />

        <div className="dashboard-content">

          <div className="notifications-message">
            Loading notifications...
          </div>

        </div>

      </div>
    );
  }


  return (
    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-content">


        {/* Header */}

        <div className="notifications-page-header">

          <div>

            <h1>Notifications</h1>

            <p>
              Compliance alerts, risks and upcoming
              deadlines
            </p>

          </div>


          <div className="notifications-header-icon">
            <FaBell />
          </div>

        </div>


        {/* Error */}

        {error && (
          <div className="notifications-message error">
            {error}
          </div>
        )}


        {!error && (
          <>


            {/* Statistics */}

            <div className="notification-stats-grid">


              <div className="notification-stat-card">

                <span>
                  Total Alerts
                </span>

                <h2>
                  {notifications.length}
                </h2>

                <p>
                  Current compliance alerts
                </p>

              </div>


              <div className="notification-stat-card critical">

                <span>
                  Critical
                </span>

                <h2>
                  {criticalCount}
                </h2>

                <p>
                  Require immediate attention
                </p>

              </div>


              <div className="notification-stat-card high">

                <span>
                  High Priority
                </span>

                <h2>
                  {highCount}
                </h2>

                <p>
                  High severity risks
                </p>

              </div>


              <div className="notification-stat-card upcoming">

                <span>
                  Upcoming
                </span>

                <h2>
                  {upcomingCount}
                </h2>

                <p>
                  Deadlines within 7 days
                </p>

              </div>

            </div>


            {/* Main Notification Panel */}

            <div className="notifications-panel">


              {/* Toolbar */}

              <div className="notifications-toolbar">

                <div>

                  <h2>
                    Compliance Alerts
                  </h2>

                  <p>
                    {filteredNotifications.length}{" "}
                    notification
                    {filteredNotifications.length !== 1
                      ? "s"
                      : ""}
                  </p>

                </div>


                <div className="notification-filters">

                  <button
                    className={
                      filter === "all"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setFilter("all")
                    }
                  >
                    All
                  </button>


                  <button
                    className={
                      filter === "overdue"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setFilter("overdue")
                    }
                  >
                    Overdue
                  </button>


                  <button
                    className={
                      filter === "risk"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setFilter("risk")
                    }
                  >
                    Risk
                  </button>


                  <button
                    className={
                      filter === "upcoming"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setFilter("upcoming")
                    }
                  >
                    Upcoming
                  </button>

                </div>

              </div>


              {/* Empty */}

              {filteredNotifications.length === 0 && (

                <div className="notifications-empty">

                  <FaBell />

                  <h3>
                    No notifications
                  </h3>

                  <p>
                    No compliance alerts match this
                    filter.
                  </p>

                </div>

              )}


              {/* Notification List */}

              <div className="notifications-list">

                {filteredNotifications.map(
                  (notification) => (

                    <div
                      className={`notification-card ${notification.type}`}
                      key={notification.id}
                    >


                      {/* Icon */}

                      <div
                        className={`notification-type-icon ${notification.type}`}
                      >
                        {getNotificationIcon(
                          notification.type
                        )}
                      </div>


                      {/* Content */}

                      <div className="notification-card-content">

                        <div className="notification-card-top">

                          <div>

                            <h3>
                              {notification.title}
                            </h3>

                            <span
                              className={`notification-priority ${notification.priority.toLowerCase()}`}
                            >
                              {notification.priority}
                            </span>

                          </div>

                        </div>


                        <p className="notification-description">
                          {notification.message}
                        </p>


                        <div className="notification-meta">

                          <span>
                            <FaBuilding />

                            {notification.company_name}
                          </span>


                          <span>
                            <FaShieldAlt />

                            {notification.rule_name}
                          </span>


                          <span>
                            <FaCalendarAlt />

                            Due{" "}
                            {formatDate(
                              notification.due_date
                            )}
                          </span>

                        </div>

                      </div>


                      {/* Action */}

                      <div className="notification-card-action">

                        <button
                          onClick={() =>
                             navigate(
                                 `/audits/${notification.check_id}`
  )
}
                        >
                          View Audit
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          </>
        )}

      </div>

    </div>
  );
}


export default Notifications;
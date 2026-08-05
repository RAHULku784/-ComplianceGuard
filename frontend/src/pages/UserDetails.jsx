import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import { getUserById } from "../services/api";

function UserDetails() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        return "Unknown";
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setError("");

        const data = await getUserById(userId);

        setUser(data);
      } catch (error) {
        console.error("User details API error:", error);
        setError("Unable to load user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-content">

        <div className="user-details-header">

          <div>
            <h1>User Details</h1>
            <p>View user information and account access</p>
          </div>

          <button
            className="back-user-btn"
            onClick={() => navigate("/users")}
          >
            ← Back to Users
          </button>

        </div>

        {loading && (
          <div className="users-message">
            Loading user details...
          </div>
        )}

        {error && (
          <div className="users-message error">
            {error}
          </div>
        )}

        {!loading && !error && user && (

          <div className="user-details-card">

            <div className="user-details-profile">

              <div className="user-details-avatar">
                {user.full_name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <h2>{user.full_name}</h2>

                <p>{user.email}</p>

                <div className="user-details-badges">

                  <span
                    className={`user-role role-${user.role_id}`}
                  >
                    {getRoleName(user.role_id)}
                  </span>

                  <span
                    className={
                      user.is_active
                        ? "user-status active"
                        : "user-status inactive"
                    }
                  >
                    {user.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>

              </div>

            </div>

            <div className="user-details-grid">

              <div className="user-detail-item">
                <span>User ID</span>
                <strong>#{user.user_id}</strong>
              </div>

              <div className="user-detail-item">
                <span>Full Name</span>
                <strong>{user.full_name}</strong>
              </div>

              <div className="user-detail-item">
                <span>Email Address</span>
                <strong>{user.email}</strong>
              </div>

              <div className="user-detail-item">
                <span>Phone Number</span>
                <strong>
                  {user.phone_number || "Not provided"}
                </strong>
              </div>

              <div className="user-detail-item">
                <span>Role</span>
                <strong>
                  {getRoleName(user.role_id)}
                </strong>
              </div>

              <div className="user-detail-item">
                <span>Account Status</span>
                <strong>
                  {user.is_active
                    ? "Active"
                    : "Inactive"}
                </strong>
              </div>

            </div>

            <div className="user-details-actions">

              <button
                className="edit-user-details-btn"
                onClick={() =>
                  navigate(
                    `/users/${user.user_id}/edit`
                  )
                }
              >
                Edit User
              </button>

            </div>

          </div>

        )}

      </div>
    </div>
  );
}

export default UserDetails;
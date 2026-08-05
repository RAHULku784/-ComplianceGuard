import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import {
  getUsers,
  updateUserStatus,
} from "../services/api";


function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");


  // ==========================================
  // Get Role Name
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
        return "Unknown";
    }
  };


  // ==========================================
  // Load Users
  // ==========================================

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();

        setUsers(data);

      } catch (error) {
        console.error("Users API error:", error);

        setError("Unable to load users.");

      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  // ==========================================
  // Activate / Deactivate User
  // ==========================================

  const handleStatusChange = async (user) => {
    try {
      setError("");

      const newStatus = !user.is_active;

      await updateUserStatus(
        user.user_id,
        newStatus
      );

      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item.user_id === user.user_id
            ? {
                ...item,
                is_active: newStatus,
              }
            : item
        )
      );

    } catch (error) {
      console.error(
        "User status update error:",
        error
      );

      setError(
        "Unable to update user status."
      );
    }
  };


  // ==========================================
  // Search + Filter
  // ==========================================

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      user.full_name
        .toLowerCase()
        .includes(searchValue) ||

      user.email
        .toLowerCase()
        .includes(searchValue) ||

      (user.phone_number || "")
        .includes(searchValue);

    const matchesRole =
      roleFilter === "all" ||
      user.role_id === Number(roleFilter);

    return matchesSearch && matchesRole;
  });


  // ==========================================
  // Statistics
  // ==========================================

  const adminCount = users.filter(
    (user) => user.role_id === 1
  ).length;

  const staffCount = users.filter(
    (user) =>
      user.role_id === 2 ||
      user.role_id === 3
  ).length;

  const customerCount = users.filter(
    (user) => user.role_id === 4
  ).length;


  return (
    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-content">


        {/* ======================================
            Header
        ====================================== */}

        <div className="users-header">

          <div>
            <h1>Users</h1>

            <p>
              Manage system users and access roles
            </p>
          </div>

          <button
            className="add-user-btn"
            onClick={() =>
              navigate("/users/new")
            }
          >
            + Add User
          </button>

        </div>


        {/* ======================================
            Statistics
        ====================================== */}

        <div className="users-stats">

          <div className="user-stat-card">
            <span>Total Users</span>
            <h2>{users.length}</h2>
          </div>

          <div className="user-stat-card">
            <span>Administrators</span>
            <h2>{adminCount}</h2>
          </div>

          <div className="user-stat-card">
            <span>
              Compliance & Auditors
            </span>

            <h2>{staffCount}</h2>
          </div>

          <div className="user-stat-card">
            <span>Customers</span>
            <h2>{customerCount}</h2>
          </div>

        </div>


        {/* ======================================
            Users Table
        ====================================== */}

        <div className="users-table-container">


          {/* Search + Filter */}

          <div className="users-toolbar">

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="users-search"
            />

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value)
              }
              className="users-role-filter"
            >
              <option value="all">
                All Roles
              </option>

              <option value="1">
                Admin
              </option>

              <option value="2">
                Compliance Officer
              </option>

              <option value="3">
                Auditor
              </option>

              <option value="4">
                Customer
              </option>

            </select>

          </div>


          {/* Loading */}

          {loading && (
            <div className="users-message">
              Loading users...
            </div>
          )}


          {/* Error */}

          {error && (
            <div className="users-message error">
              {error}
            </div>
          )}


          {/* Table */}

          {!loading && !error && (
            <table className="users-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>


              <tbody>

                {filteredUsers.map((user) => (

                  <tr key={user.user_id}>


                    {/* ID */}

                    <td className="user-id">
                      #{user.user_id}
                    </td>


                    {/* User */}

                    <td>

                      <div className="user-name-cell">

                        <div className="user-avatar">
                          {user.full_name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <strong>
                          {user.full_name}
                        </strong>

                      </div>

                    </td>


                    {/* Email */}

                    <td>
                      {user.email}
                    </td>


                    {/* Phone */}

                    <td>
                      {user.phone_number || "—"}
                    </td>


                    {/* Role */}

                    <td>

                      <span
                        className={`user-role role-${user.role_id}`}
                      >
                        {getRoleName(
                          user.role_id
                        )}
                      </span>

                    </td>


                    {/* Status */}

                    <td>

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

                    </td>


                    {/* Actions */}

                    <td>

                      <div className="user-actions">

                        <button
                          className="user-action-btn view"
                          onClick={() =>
                            navigate(
                              `/users/${user.user_id}`
                            )
                          }
                        >
                          View
                        </button>


                        <button
                          className="user-action-btn edit"
                          onClick={() =>
                            navigate(
                              `/users/${user.user_id}/edit`
                            )
                          }
                        >
                          Edit
                        </button>


                        <button
                          className={`user-action-btn ${
                            user.is_active
                              ? "deactivate"
                              : "activate"
                          }`}
                          onClick={() =>
                            handleStatusChange(
                              user
                            )
                          }
                        >
                          {user.is_active
                            ? "Deactivate"
                            : "Activate"}
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>
          )}


          {/* No Users */}

          {!loading &&
            !error &&
            filteredUsers.length === 0 && (

              <div className="users-message">
                No users found.
              </div>

            )}

        </div>

      </div>

    </div>
  );
}


export default Users;
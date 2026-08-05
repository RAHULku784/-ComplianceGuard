import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import { createUser } from "../services/api";

function NewUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone_number: "",
    role_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone_number:
          formData.phone_number.trim() || null,
        role_id: Number(formData.role_id),
      };

      await createUser(payload);

      setSuccess("User created successfully!");

      setTimeout(() => {
        navigate("/users");
      }, 700);

    } catch (error) {
      console.error("Create user error:", error);

      setError(
        typeof error.message === "string"
          ? error.message
          : "Unable to create user."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-content">

        <div className="new-user-header">

          <div>
            <h1>Add New User</h1>
            <p>Create a new user and assign their access role</p>
          </div>

          <button
            type="button"
            className="back-user-btn"
            onClick={() => navigate("/users")}
          >
            ← Back to Users
          </button>

        </div>

        <div className="new-user-card">

          {error && (
            <div className="user-form-error">
              {error}
            </div>
          )}

          {success && (
            <div className="user-form-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="user-form-grid">

              <div className="user-form-group">
                <label>Full Name</label>

                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="user-form-group">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="user-form-group">
                <label>Phone Number</label>

                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="user-form-group">
                <label>Role</label>

                <select
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Role
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

              <div className="user-form-group user-password-field">
                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  minLength="6"
                />
              </div>

            </div>

            <div className="user-form-actions">

              <button
                type="button"
                className="cancel-user-btn"
                onClick={() => navigate("/users")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="create-user-btn"
                disabled={loading}
              >
                {loading
                  ? "Creating User..."
                  : "Create User"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default NewUser;
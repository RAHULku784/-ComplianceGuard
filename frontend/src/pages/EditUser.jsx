import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import {
  getUserById,
  updateUser,
} from "../services/api";


function EditUser() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    role_id: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // ==========================================
  // Load Existing User
  // ==========================================

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setError("");

        const data = await getUserById(userId);

        setFormData({
          full_name: data.full_name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          role_id: data.role_id || "",
        });

      } catch (error) {
        console.error(
          "Load user error:",
          error
        );

        setError(
          "Unable to load user details."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchUser();

  }, [userId]);


  // ==========================================
  // Input Change
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // ==========================================
  // Update User
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),

        phone_number:
          formData.phone_number.trim() || null,

        role_id: Number(formData.role_id),
      };

      await updateUser(
        userId,
        payload
      );

      setSuccess(
        "User updated successfully!"
      );

      setTimeout(() => {
        navigate(`/users/${userId}`);
      }, 700);

    } catch (error) {
      console.error(
        "Update user error:",
        error
      );

      setError(
        error.message ||
        "Unable to update user."
      );

    } finally {
      setSaving(false);
    }
  };


  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="dashboard">

        <Sidebar />

        <div className="dashboard-content">

          <div className="users-message">
            Loading user...
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

        <div className="new-user-header">

          <div>
            <h1>Edit User</h1>

            <p>
              Update user information and access role
            </p>
          </div>

          <button
            type="button"
            className="back-user-btn"
            onClick={() =>
              navigate(`/users/${userId}`)
            }
          >
            ← Back to User
          </button>

        </div>


        {/* Form Card */}

        <div className="new-user-card">


          {/* Error */}

          {error && (
            <div className="user-form-error">
              {error}
            </div>
          )}


          {/* Success */}

          {success && (
            <div className="user-form-success">
              {success}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            <div className="user-form-grid">


              {/* Full Name */}

              <div className="user-form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />

              </div>


              {/* Email */}

              <div className="user-form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />

              </div>


              {/* Phone */}

              <div className="user-form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />

              </div>


              {/* Role */}

              <div className="user-form-group">

                <label>
                  Role
                </label>

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

            </div>


            {/* Actions */}

            <div className="user-form-actions">

              <button
                type="button"
                className="cancel-user-btn"
                onClick={() =>
                  navigate(`/users/${userId}`)
                }
              >
                Cancel
              </button>


              <button
                type="submit"
                className="create-user-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving Changes..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}


export default EditUser;
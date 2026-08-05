import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

import {
  FaUser,
  FaLock,
  FaPalette,
  FaBell,
  FaShieldAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

import {
  getProfile,
  changePassword,
} from "../services/api";

import { useTheme } from "../context/ThemeContext";


function Settings() {
  const { changeTheme } = useTheme();

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    role_id: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [notifications, setNotifications] = useState({
    overdue: true,
    deadline: true,
    highRisk: true,
  });

  // Password states
  const [showPasswordForm, setShowPasswordForm] =
    useState(false);

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [passwordLoading, setPasswordLoading] =
    useState(false);

  const [passwordError, setPasswordError] =
    useState("");

  const [passwordSuccess, setPasswordSuccess] =
    useState("");


  const getRoleName = (roleId) => {
    switch (roleId) {
      case 1:
        return "Administrator";

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


  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();

        setProfile(data);

      } catch (error) {
        console.error(
          "Settings profile error:",
          error
        );

        setError(
          "Unable to load account information."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

  }, []);


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const handleNotificationChange = (name) => {
    setNotifications((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };


  // =====================================================
  // PASSWORD INPUT
  // =====================================================

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");


    if (
      passwordData.new_password !==
      passwordData.confirm_password
    ) {
      setPasswordError(
        "New passwords do not match."
      );

      return;
    }


    if (passwordData.new_password.length < 6) {
      setPasswordError(
        "New password must contain at least 6 characters."
      );

      return;
    }


    try {
      setPasswordLoading(true);

      const result = await changePassword(
        passwordData.current_password,
        passwordData.new_password
      );


      setPasswordSuccess(
        result.message ||
          "Password changed successfully."
      );


      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });


      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess("");
      }, 1500);


    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      setPasswordError(
        error.message ||
          "Unable to change password."
      );

    } finally {
      setPasswordLoading(false);
    }
  };


  // =====================================================
  // CANCEL PASSWORD CHANGE
  // =====================================================

  const handlePasswordCancel = () => {
    setShowPasswordForm(false);

    setPasswordError("");
    setPasswordSuccess("");

    setPasswordData({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });
  };


  return (
    <div className="dashboard">

      <Sidebar />


      <div className="dashboard-content">


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="settings-header">

          <div>
            <h1>Settings</h1>

            <p>
              Manage your account, appearance and
              notification preferences
            </p>
          </div>

          <div className="settings-header-icon">
            <FaShieldAlt />
          </div>

        </div>


        {error && (
          <div className="settings-error">
            {error}
          </div>
        )}


        {/* ==================================================
            ACCOUNT
        ================================================== */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon">
              <FaUser />
            </div>

            <div>
              <h2>My Account</h2>

              <p>
                Your Compliance Guard account information
              </p>
            </div>

          </div>


          {loading ? (

            <div className="settings-loading">
              Loading account information...
            </div>

          ) : (

            <div className="settings-profile-grid">


              <div className="settings-profile-item">

                <span>
                  Full Name
                </span>

                <strong>
                  {profile.full_name || "—"}
                </strong>

              </div>


              <div className="settings-profile-item">

                <span>
                  <FaEnvelope />
                  Email Address
                </span>

                <strong>
                  {profile.email || "—"}
                </strong>

              </div>


              <div className="settings-profile-item">

                <span>
                  <FaPhone />
                  Phone Number
                </span>

                <strong>
                  {profile.phone_number || "—"}
                </strong>

              </div>


              <div className="settings-profile-item">

                <span>
                  <FaShieldAlt />
                  Account Role
                </span>

                <strong>
                  {getRoleName(profile.role_id)}
                </strong>

              </div>


            </div>

          )}

        </div>


        {/* ==================================================
            APPEARANCE
        ================================================== */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon purple">
              <FaPalette />
            </div>

            <div>

              <h2>Appearance</h2>

              <p>
                Choose your preferred dashboard theme
              </p>

            </div>

          </div>


          <div className="settings-theme-grid">


            <button
              type="button"
              className="settings-theme-option"
              onClick={() =>
                changeTheme("dark")
              }
            >
              <div className="theme-preview dark-preview">
                <div />
                <span />
                <span />
              </div>

              <strong>
                🌙 Dark
              </strong>

              <span>
                Classic dark interface
              </span>
            </button>


            <button
              type="button"
              className="settings-theme-option"
              onClick={() =>
                changeTheme("light")
              }
            >
              <div className="theme-preview light-preview">
                <div />
                <span />
                <span />
              </div>

              <strong>
                ☀️ Light
              </strong>

              <span>
                Clean bright interface
              </span>
            </button>


            <button
              type="button"
              className="settings-theme-option"
              onClick={() =>
                changeTheme("midnight")
              }
            >
              <div className="theme-preview midnight-preview">
                <div />
                <span />
                <span />
              </div>

              <strong>
                🌌 Blue Midnight
              </strong>

              <span>
                Deep blue interface
              </span>
            </button>


          </div>

        </div>


        {/* ==================================================
            NOTIFICATIONS
        ================================================== */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon warning">
              <FaBell />
            </div>

            <div>

              <h2>
                Notification Preferences
              </h2>

              <p>
                Choose which compliance alerts you
                want to receive
              </p>

            </div>

          </div>


          <div className="settings-notification-list">


            <div className="settings-notification-item">

              <div>

                <strong>
                  Overdue Audit Alerts
                </strong>

                <span>
                  Notify when an audit passes its
                  compliance deadline
                </span>

              </div>


              <label className="settings-switch">

                <input
                  type="checkbox"
                  checked={notifications.overdue}
                  onChange={() =>
                    handleNotificationChange(
                      "overdue"
                    )
                  }
                />

                <span className="settings-slider" />

              </label>

            </div>


            <div className="settings-notification-item">

              <div>

                <strong>
                  Deadline Reminders
                </strong>

                <span>
                  Notify when an audit deadline is
                  approaching
                </span>

              </div>


              <label className="settings-switch">

                <input
                  type="checkbox"
                  checked={notifications.deadline}
                  onChange={() =>
                    handleNotificationChange(
                      "deadline"
                    )
                  }
                />

                <span className="settings-slider" />

              </label>

            </div>


            <div className="settings-notification-item">

              <div>

                <strong>
                  High Risk Alerts
                </strong>

                <span>
                  Notify about high and critical
                  compliance risks
                </span>

              </div>


              <label className="settings-switch">

                <input
                  type="checkbox"
                  checked={notifications.highRisk}
                  onChange={() =>
                    handleNotificationChange(
                      "highRisk"
                    )
                  }
                />

                <span className="settings-slider" />

              </label>

            </div>


          </div>

        </div>


        {/* ==================================================
            SECURITY
        ================================================== */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon security">
              <FaLock />
            </div>

            <div>

              <h2>
                Account Security
              </h2>

              <p>
                Manage password and account security
              </p>

            </div>

          </div>


          <div className="settings-security-row">

            <div>

              <strong>
                Password
              </strong>

              <span>
                Change your account password regularly
                to keep your account secure.
              </span>

            </div>


            {!showPasswordForm && (

              <button
                type="button"
                className="settings-password-btn"
                onClick={() => {
                  setShowPasswordForm(true);
                  setPasswordError("");
                  setPasswordSuccess("");
                }}
              >
                <FaLock />
                Change Password
              </button>

            )}

          </div>


          {/* Password Form */}

          {showPasswordForm && (

            <form
              className="settings-password-form"
              onSubmit={handlePasswordSubmit}
            >


              {passwordError && (

                <div className="password-change-error">
                  {passwordError}
                </div>

              )}


              {passwordSuccess && (

                <div className="password-change-success">
                  {passwordSuccess}
                </div>

              )}


              <div className="password-form-grid">


                <div className="password-form-group">

                  <label>
                    Current Password
                  </label>

                  <input
                    type="password"
                    name="current_password"
                    value={
                      passwordData.current_password
                    }
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                    required
                  />

                </div>


                <div className="password-form-group">

                  <label>
                    New Password
                  </label>

                  <input
                    type="password"
                    name="new_password"
                    value={
                      passwordData.new_password
                    }
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    minLength="6"
                    required
                  />

                </div>


                <div className="password-form-group">

                  <label>
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    name="confirm_password"
                    value={
                      passwordData.confirm_password
                    }
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    minLength="6"
                    required
                  />

                </div>


              </div>


              <div className="password-form-actions">


                <button
                  type="button"
                  className="password-cancel-btn"
                  disabled={passwordLoading}
                  onClick={handlePasswordCancel}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="password-save-btn"
                  disabled={passwordLoading}
                >
                  {passwordLoading
                    ? "Changing Password..."
                    : "Update Password"}
                </button>


              </div>


            </form>

          )}

        </div>


        {/* ==================================================
            APPLICATION
        ================================================== */}

        <div className="settings-card application-info">

          <div>

            <FaShieldAlt />

            <div>

              <strong>
                Compliance Guard AI
              </strong>

              <span>
                Compliance Management Platform
              </span>

            </div>

          </div>


          <span className="settings-version">
            Version 1.0
          </span>

        </div>


      </div>

    </div>
  );
}


export default Settings;
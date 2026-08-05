import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import {
  getRuleById,
  updateRule,
} from "../services/api";

import {
  FaArrowLeft,
  FaBook,
  FaLayerGroup,
  FaExclamationTriangle,
  FaCheckCircle,
  FaAlignLeft,
  FaEdit,
  FaSave,
  FaTimes,
  FaPowerOff,
} from "react-icons/fa";


function RuleDetails() {
  const navigate = useNavigate();
  const { ruleId } = useParams();

  const [rule, setRule] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const [editing, setEditing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    rule_name: "",
    description: "",
    category: "",
    severity: "Medium",
    status: true,
  });


  // ======================================================
  // LOAD RULE
  // ======================================================

  useEffect(() => {
    const fetchRule = async () => {
      try {
        setError("");

        const data = await getRuleById(ruleId);

        setRule(data);

        setFormData({
          rule_name: data.rule_name || "",
          description: data.description || "",
          category: data.category || "",
          severity: data.severity || "Medium",
          status: data.status ?? true,
        });

      } catch (error) {
        console.error(
          "Rule details error:",
          error
        );

        setError(
          "Unable to load compliance rule."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchRule();

  }, [ruleId]);


  // ======================================================
  // FORM CHANGE
  // ======================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // ======================================================
  // START EDIT
  // ======================================================

  const handleEdit = () => {
    setFormData({
      rule_name: rule.rule_name || "",
      description: rule.description || "",
      category: rule.category || "",
      severity: rule.severity || "Medium",
      status: rule.status ?? true,
    });

    setError("");
    setSuccess("");
    setEditing(true);
  };


  // ======================================================
  // CANCEL EDIT
  // ======================================================

  const handleCancel = () => {
    setFormData({
      rule_name: rule.rule_name || "",
      description: rule.description || "",
      category: rule.category || "",
      severity: rule.severity || "Medium",
      status: rule.status ?? true,
    });

    setEditing(false);
    setError("");
  };


  // ======================================================
  // SAVE RULE
  // ======================================================

  const handleSave = async () => {
    if (!formData.rule_name.trim()) {
      setError("Rule name is required.");
      return;
    }

    if (!formData.category.trim()) {
      setError("Category is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        rule_name: formData.rule_name.trim(),

        description:
          formData.description.trim() || null,

        category:
          formData.category.trim() || null,

        severity: formData.severity,

        status: rule.status,
      };

      await updateRule(
        ruleId,
        payload
      );

      const refreshedRule =
        await getRuleById(ruleId);

      setRule(refreshedRule);

      setFormData({
        rule_name:
          refreshedRule.rule_name || "",

        description:
          refreshedRule.description || "",

        category:
          refreshedRule.category || "",

        severity:
          refreshedRule.severity || "Medium",

        status:
          refreshedRule.status ?? true,
      });

      setEditing(false);

      setSuccess(
        "Compliance rule updated successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);

    } catch (error) {
      console.error(
        "Update rule error:",
        error
      );

      setError(
        error.message ||
          "Unable to update compliance rule."
      );

    } finally {
      setSaving(false);
    }
  };


  // ======================================================
  // ACTIVATE / DEACTIVATE
  // ======================================================

  const handleStatusToggle = async () => {
    try {
      setStatusUpdating(true);
      setError("");
      setSuccess("");

      const newStatus = !rule.status;

      const payload = {
        rule_name: rule.rule_name,
        description: rule.description,
        category: rule.category,
        severity: rule.severity,
        status: newStatus,
      };

      await updateRule(
        ruleId,
        payload
      );

      const refreshedRule =
        await getRuleById(ruleId);

      setRule(refreshedRule);

      setFormData({
        rule_name:
          refreshedRule.rule_name || "",

        description:
          refreshedRule.description || "",

        category:
          refreshedRule.category || "",

        severity:
          refreshedRule.severity || "Medium",

        status:
          refreshedRule.status ?? true,
      });

      setSuccess(
        newStatus
          ? "Compliance rule activated successfully."
          : "Compliance rule deactivated successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);

    } catch (error) {
      console.error(
        "Rule status update error:",
        error
      );

      setError(
        error.message ||
          "Unable to change rule status."
      );

    } finally {
      setStatusUpdating(false);
    }
  };


  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="dashboard">

        <Sidebar />

        <div className="dashboard-content">

          <div className="rule-details-message">
            Loading compliance rule...
          </div>

        </div>

      </div>
    );
  }


  // ======================================================
  // NOT FOUND
  // ======================================================

  if (!rule) {
    return (
      <div className="dashboard">

        <Sidebar />

        <div className="dashboard-content">

          <div className="rule-details-message error">
            {error ||
              "Compliance rule not found."}
          </div>

        </div>

      </div>
    );
  }


  return (
    <div className="dashboard">

      <Sidebar />


      <div className="dashboard-content">


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="rule-details-header">

          <div>

            <button
              className="rule-details-back"
              onClick={() =>
                navigate("/rules")
              }
            >
              <FaArrowLeft />

              Back to Rules
            </button>


            {editing ? (

              <input
                type="text"
                name="rule_name"
                value={formData.rule_name}
                onChange={handleChange}
                className="rule-title-edit-input"
                placeholder="Rule name"
              />

            ) : (

              <h1>
                {rule.rule_name}
              </h1>

            )}


            <p>
              Compliance rule details and requirements
            </p>

          </div>


          <div className="rule-details-header-actions">


            {!editing && (

              <button
                className="rule-edit-btn"
                onClick={handleEdit}
              >
                <FaEdit />

                Edit Rule
              </button>

            )}


            {!editing && (

              <button
                className={
                  rule.status
                    ? "rule-toggle-btn deactivate"
                    : "rule-toggle-btn activate"
                }
                onClick={handleStatusToggle}
                disabled={statusUpdating}
              >
                <FaPowerOff />

                {statusUpdating
                  ? "Updating..."
                  : rule.status
                  ? "Deactivate"
                  : "Activate"}
              </button>

            )}


            <span
              className={
                rule.status
                  ? "rule-details-status active"
                  : "rule-details-status inactive"
              }
            >
              {rule.status
                ? "Active"
                : "Inactive"}
            </span>

          </div>

        </div>


        {/* ==================================================
            SUCCESS
        ================================================== */}

        {success && (

          <div className="rule-update-success">
            {success}
          </div>

        )}


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (

          <div className="rule-update-error">
            {error}
          </div>

        )}


        {/* ==================================================
            INFORMATION
        ================================================== */}

        <div className="rule-details-card">


          {/* Rule ID */}

          <div className="rule-detail-item">

            <div className="rule-detail-icon">
              <FaBook />
            </div>

            <div>

              <span>
                Rule ID
              </span>

              <strong>
                #{rule.rule_id}
              </strong>

            </div>

          </div>


          {/* Category */}

          <div className="rule-detail-item">

            <div className="rule-detail-icon">
              <FaLayerGroup />
            </div>

            <div className="rule-edit-field">

              <span>
                Category
              </span>


              {editing ? (

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="rule-edit-input"
                  placeholder="Category"
                />

              ) : (

                <strong>
                  {rule.category ||
                    "Not specified"}
                </strong>

              )}

            </div>

          </div>


          {/* Severity */}

          <div className="rule-detail-item">

            <div className="rule-detail-icon">
              <FaExclamationTriangle />
            </div>

            <div className="rule-edit-field">

              <span>
                Severity
              </span>


              {editing ? (

                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="rule-edit-input"
                >
                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>

                  <option value="Critical">
                    Critical
                  </option>
                </select>

              ) : (

                <strong
                  className={`rule-severity-text ${
                    rule.severity
                      ?.toLowerCase()
                  }`}
                >
                  {rule.severity ||
                    "Not specified"}
                </strong>

              )}

            </div>

          </div>


          {/* Status */}

          <div className="rule-detail-item">

            <div className="rule-detail-icon">
              <FaCheckCircle />
            </div>

            <div>

              <span>
                Status
              </span>

              <strong>
                {rule.status
                  ? "Active"
                  : "Inactive"}
              </strong>

            </div>

          </div>


        </div>


        {/* ==================================================
            DESCRIPTION
        ================================================== */}

        <div className="rule-description-card">


          <div className="rule-description-title">

            <FaAlignLeft />

            <div>

              <h2>
                Description
              </h2>

              <p>
                Compliance policy requirements
              </p>

            </div>

          </div>


          {editing ? (

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="rule-edit-description"
              rows="6"
              placeholder="Enter compliance rule description..."
            />

          ) : (

            <div className="rule-description-content">

              {rule.description ||
                "No description has been provided for this rule."}

            </div>

          )}


          {/* ================================================
              EDIT BUTTONS
          ================================================ */}

          {editing && (

            <div className="rule-edit-actions">


              <button
                type="button"
                className="rule-edit-cancel"
                onClick={handleCancel}
                disabled={saving}
              >
                <FaTimes />

                Cancel
              </button>


              <button
                type="button"
                className="rule-edit-save"
                onClick={handleSave}
                disabled={saving}
              >
                <FaSave />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>


            </div>

          )}


        </div>


      </div>

    </div>
  );
}


export default RuleDetails;
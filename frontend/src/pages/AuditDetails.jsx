import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import {
  getAuditById,
  updateAudit,
} from "../services/api";

import {
  FaArrowLeft,
  FaBuilding,
  FaCalendarAlt,
  FaClipboardCheck,
  FaUserShield,
  FaCommentAlt,
  FaExclamationTriangle,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";


function AuditDetails() {

  const navigate = useNavigate();
  const { auditId } = useParams();

  const [audit, setAudit] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    status: "",
    due_date: "",
    remarks: "",
  });


  // ==========================================
  // FETCH AUDIT
  // ==========================================

  useEffect(() => {

    const fetchAudit = async () => {

      try {

        setError("");

        const data = await getAuditById(auditId);

        setAudit(data);

        setFormData({
          status: data.status || "Pending",
          due_date: data.due_date || "",
          remarks: data.remarks || "",
        });

      } catch (error) {

        console.error(
          "Audit details error:",
          error
        );

        setError(
          "Unable to load audit details."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchAudit();

  }, [auditId]);


  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancelEdit = () => {

    setFormData({
      status: audit.status || "Pending",
      due_date: audit.due_date || "",
      remarks: audit.remarks || "",
    });

    setEditing(false);
    setError("");

  };


  // ==========================================
  // SAVE AUDIT
  // ==========================================

  const handleSave = async () => {

    try {

      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        status: formData.status,
        due_date: formData.due_date || null,
        remarks: formData.remarks.trim() || null,
      };

      await updateAudit(
        auditId,
        payload
      );

      // Get fresh enriched audit details
      // after update
      const refreshedAudit =
        await getAuditById(auditId);

      setAudit(refreshedAudit);

      setFormData({
        status:
          refreshedAudit.status || "Pending",

        due_date:
          refreshedAudit.due_date || "",

        remarks:
          refreshedAudit.remarks || "",
      });

      setEditing(false);

      setSuccess(
        "Audit updated successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);

    } catch (error) {

      console.error(
        "Update audit error:",
        error
      );

      setError(
        error.message ||
        "Unable to update audit."
      );

    } finally {

      setSaving(false);

    }

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="dashboard">

        <Sidebar />

        <div className="dashboard-content">

          <div className="audit-details-message">
            Loading audit details...
          </div>

        </div>

      </div>

    );

  }


  // ==========================================
  // ERROR PAGE
  // ==========================================

  if (!audit) {

    return (

      <div className="dashboard">

        <Sidebar />

        <div className="dashboard-content">

          <div className="audit-details-message error">
            {error || "Audit not found."}
          </div>

        </div>

      </div>

    );

  }


  return (

    <div className="dashboard">

      <Sidebar />


      <div className="dashboard-content">


        {/* HEADER */}

        <div className="audit-details-header">

          <div>

            <button
              className="audit-details-back"
              onClick={() =>
                navigate("/audits")
              }
            >
              <FaArrowLeft />

              Back to Audits
            </button>


            <h1>
              Audit #{audit.audit_id}
            </h1>


            <p>
              Compliance audit details
            </p>

          </div>


          <div className="audit-details-header-actions">


            {!editing && (

              <button
                className="audit-edit-btn"
                onClick={() => {
                  setEditing(true);
                  setSuccess("");
                  setError("");
                }}
              >
                <FaEdit />

                Edit Audit
              </button>

            )}


            <span
              className={`audit-details-status ${
                audit.status
                  ?.toLowerCase()
                  .replaceAll(" ", "-")
              }`}
            >
              {audit.status}
            </span>


          </div>

        </div>


        {/* SUCCESS */}

        {success && (

          <div className="audit-update-success">
            {success}
          </div>

        )}


        {/* ERROR */}

        {error && (

          <div className="audit-update-error">
            {error}
          </div>

        )}


        {/* AUDIT INFORMATION */}

        <div className="audit-details-card">


          {/* Company */}

          <div className="audit-detail-item">

            <div className="audit-detail-icon">
              <FaBuilding />
            </div>

            <div>

              <span>
                Company
              </span>

              <strong>
                {audit.company_name}
              </strong>

            </div>

          </div>


          {/* Rule */}

          <div className="audit-detail-item">

            <div className="audit-detail-icon">
              <FaClipboardCheck />
            </div>

            <div>

              <span>
                Compliance Rule
              </span>

              <strong>
                {audit.rule_name}
              </strong>

            </div>

          </div>


          {/* Auditor */}

          <div className="audit-detail-item">

            <div className="audit-detail-icon">
              <FaUserShield />
            </div>

            <div>

              <span>
                Auditor
              </span>

              <strong>
                {audit.auditor}
              </strong>

            </div>

          </div>


          {/* Due Date */}

          <div className="audit-detail-item">

            <div className="audit-detail-icon">
              <FaCalendarAlt />
            </div>

            <div className="audit-detail-field">

              <span>
                Due Date
              </span>


              {editing ? (

                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="audit-edit-input"
                />

              ) : (

                <strong>
                  {audit.due_date ||
                    "No due date"}
                </strong>

              )}

            </div>

          </div>


          {/* Risk */}

          <div className="audit-detail-item">

            <div className="audit-detail-icon">
              <FaExclamationTriangle />
            </div>

            <div>

              <span>
                Risk Level
              </span>

              <strong
                className={`audit-risk-value ${
                  audit.risk_level
                    ?.toLowerCase()
                }`}
              >
                {audit.risk_level ||
                  "Unknown"}
              </strong>

            </div>

          </div>


          {/* Status Editor */}

          {editing && (

            <div className="audit-detail-item">

              <div className="audit-detail-icon">
                <FaClipboardCheck />
              </div>

              <div className="audit-detail-field">

                <span>
                  Status
                </span>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="audit-edit-input"
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>
                </select>

              </div>

            </div>

          )}


        </div>


        {/* REMARKS */}

        <div className="audit-remarks-card">


          <div className="audit-remarks-title">

            <FaCommentAlt />

            <div>

              <h2>
                Remarks
              </h2>

              <p>
                Additional information about this audit
              </p>

            </div>

          </div>


          {editing ? (

            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="audit-edit-remarks"
              rows="5"
              placeholder="Enter audit remarks..."
            />

          ) : (

            <div className="audit-remarks-content">

              {audit.remarks ||
                "No remarks have been added."}

            </div>

          )}


          {/* EDIT ACTIONS */}

          {editing && (

            <div className="audit-edit-actions">


              <button
                type="button"
                className="audit-edit-cancel"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                <FaTimes />

                Cancel
              </button>


              <button
                type="button"
                className="audit-edit-save"
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


export default AuditDetails;
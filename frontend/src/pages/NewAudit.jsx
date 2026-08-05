import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

import {
  createAudit,
  getRules,
  getCompanies,
} from "../services/api";

function NewAudit() {
  const navigate = useNavigate();

  // Rules from backend
  const [rules, setRules] = useState([]);
  const [rulesLoading, setRulesLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);

  // Form data
  const [formData, setFormData] = useState({
    rule_id: "",
    company_name: "",
    due_date: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==============================
  // Fetch Compliance Rules
  // ==============================
  useEffect(() => {
  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error("Companies API error:", error);
      setError("Unable to load companies.");
    } finally {
      setCompaniesLoading(false);
    }
  };

  fetchCompanies();
}, []);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const data = await getRules();

        // Show only active rules
        const activeRules = data.filter(
          (rule) => rule.status === true
        );

        setRules(activeRules);
      } catch (error) {
        console.error("Rules API error:", error);
        setError("Unable to load compliance rules.");
      } finally {
        setRulesLoading(false);
      }
    };

    fetchRules();
  }, []);

  // ==============================
  // Handle Input Changes
  // ==============================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==============================
  // Create Audit
  // ==============================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        rule_id: Number(formData.rule_id),
        company_name: formData.company_name.trim(),
        due_date: formData.due_date,
        remarks: formData.remarks.trim() || null,
      };

      console.log("Creating audit:", payload);

      await createAudit(payload);

      setSuccess("Audit created successfully!");

      setTimeout(() => {
        navigate("/audits");
      }, 700);
    } catch (error) {
      console.error("Create audit error:", error);

      setError(
        error.message || "Unable to create audit."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-content">

        {/* Header */}

        <div className="new-audit-header">

          <div>
            <h1>Create New Audit</h1>
            <p>
              Add a new compliance audit to the system
            </p>
          </div>

          <button
            type="button"
            className="back-audit-btn"
            onClick={() => navigate("/audits")}
          >
            ← Back to Audits
          </button>

        </div>

        {/* Form Card */}

        <div className="new-audit-card">

          {/* Error */}

          {error && (
            <div className="audit-form-error">
              {error}
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="audit-form-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="audit-form-grid">

              {/* Compliance Rule */}

              <div className="audit-form-group">

                <label>Compliance Rule</label>

                <select
                  name="rule_id"
                  value={formData.rule_id}
                  onChange={handleChange}
                  required
                  disabled={rulesLoading}
                >

                  <option value="">
                    {rulesLoading
                      ? "Loading compliance rules..."
                      : "Select compliance rule"}
                  </option>

                  {rules.map((rule) => (
                    <option
                      key={rule.rule_id}
                      value={rule.rule_id}
                    >
                      {rule.rule_name}
                      {rule.severity
                        ? ` — ${rule.severity}`
                        : ""}
                    </option>
                  ))}

                </select>

              </div>

              {/* Company */}

              <div className="audit-form-group">

                <label>Company Name</label>

                <select
  name="company_name"
  value={formData.company_name}
  onChange={handleChange}
  required
  disabled={companiesLoading}
>
  <option value="">
    {companiesLoading
      ? "Loading companies..."
      : "Select company"}
  </option>

  {companies.map((company) => (
    <option
      key={company.company_id}
      value={company.company_name}
    >
      {company.company_name}
      {company.gstin ? ` — ${company.gstin}` : ""}
    </option>
  ))}
</select>

              </div>

              {/* Due Date */}

              <div className="audit-form-group">

                <label>Due Date</label>

                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* Remarks */}

            <div className="audit-form-group audit-remarks-field">

              <label>Remarks</label>

              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Enter audit remarks..."
                rows="5"
              />

            </div>

            {/* Buttons */}

            <div className="audit-form-actions">

              <button
                type="button"
                className="cancel-audit-btn"
                onClick={() => navigate("/audits")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="create-audit-btn"
                disabled={loading || rulesLoading}
              >
                {loading
                  ? "Creating Audit..."
                  : "Create Audit"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default NewAudit;
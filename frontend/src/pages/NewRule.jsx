import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import { createRule } from "../services/api";

import {
  FaArrowLeft,
  FaBook,
} from "react-icons/fa";


function NewRule() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rule_name: "",
    description: "",
    category: "",
    severity: "Medium",
    status: true,
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
        rule_name: formData.rule_name.trim(),
        description:
          formData.description.trim() || null,
        category:
          formData.category.trim() || null,
        severity: formData.severity,
        status: true,
      };

      console.log(
        "Creating compliance rule:",
        payload
      );

      await createRule(payload);

      setSuccess(
        "Compliance rule created successfully!"
      );

      setTimeout(() => {
        navigate("/rules");
      }, 700);

    } catch (error) {
      console.error(
        "Create rule error:",
        error
      );

      setError(
        error.message ||
          "Unable to create compliance rule."
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

        <div className="new-rule-header">

          <div>
            <h1>Create Compliance Rule</h1>

            <p>
              Add a new compliance policy or
              audit requirement
            </p>
          </div>


          <button
            type="button"
            className="back-rule-btn"
            onClick={() =>
              navigate("/rules")
            }
          >
            <FaArrowLeft />
            Back to Rules
          </button>

        </div>


        {/* Form Card */}

        <div className="new-rule-card">


          <div className="new-rule-card-title">

            <div className="new-rule-title-icon">
              <FaBook />
            </div>

            <div>
              <h2>Rule Information</h2>

              <p>
                Define the compliance rule
                details
              </p>
            </div>

          </div>


          {error && (
            <div className="rule-form-error">
              {error}
            </div>
          )}


          {success && (
            <div className="rule-form-success">
              {success}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            <div className="rule-form-grid">


              {/* Rule Name */}

              <div className="rule-form-group">

                <label>
                  Rule Name
                </label>

                <input
                  type="text"
                  name="rule_name"
                  value={formData.rule_name}
                  onChange={handleChange}
                  placeholder="Enter compliance rule name"
                  required
                />

              </div>


              {/* Category */}

              <div className="rule-form-group">

                <label>
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Tax, Finance, Security"
                  required
                />

              </div>


              {/* Severity */}

              <div className="rule-form-group">

                <label>
                  Severity
                </label>

                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  required
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

              </div>

            </div>


            {/* Description */}

            <div className="rule-form-group rule-description-field">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the compliance requirement..."
                rows="6"
                required
              />

            </div>


            {/* Actions */}

            <div className="rule-form-actions">

              <button
                type="button"
                className="cancel-rule-btn"
                onClick={() =>
                  navigate("/rules")
                }
              >
                Cancel
              </button>


              <button
                type="submit"
                className="create-rule-btn"
                disabled={loading}
              >
                {loading
                  ? "Creating Rule..."
                  : "Create Rule"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}


export default NewRule;
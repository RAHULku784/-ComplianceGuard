import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getAudits } from "../services/api";
import {
  FaSearch,
  FaClipboardCheck,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPlus,
} from "react-icons/fa";

function Audit() {
  const navigate = useNavigate();

  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const data = await getAudits();
        setAudits(data);
      } catch (error) {
        console.error("Audit API error:", error);
        setError("Unable to load audits.");
      } finally {
        setLoading(false);
      }
    };

    fetchAudits();
  }, []);

  const filteredAudits = audits.filter((audit) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      audit.rule_name?.toLowerCase().includes(searchValue) ||
      audit.company_name?.toLowerCase().includes(searchValue) ||
      audit.auditor?.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "All" || audit.status === statusFilter;

    const matchesRisk =
      riskFilter === "All" || audit.risk_level === riskFilter;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  const totalAudits = audits.length;

  const completedAudits = audits.filter(
    (audit) => audit.status === "Completed"
  ).length;

  const pendingAudits = audits.filter(
    (audit) => audit.status === "Pending"
  ).length;

  const criticalAudits = audits.filter(
    (audit) => audit.risk_level === "Critical"
  ).length;

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-content audit-page">

        {/* Header */}
        <div className="audit-page-header">
          <div>
            <h1>Audits</h1>
            <p>Monitor and manage compliance audits</p>
          </div>

          <button
            className="new-audit-btn"
            onClick={() => navigate("/audits/new")}
          >
            <FaPlus />
            New Audit
          </button>
        </div>

        {/* Summary Cards */}
        <div className="audit-summary-grid">

          <div className="audit-summary-card">
            <div className="audit-summary-icon">
              <FaClipboardCheck />
            </div>

            <div>
              <span>Total Audits</span>
              <h2>{totalAudits}</h2>
            </div>
          </div>

          <div className="audit-summary-card">
            <div className="audit-summary-icon">
              <FaCheckCircle />
            </div>

            <div>
              <span>Completed</span>
              <h2>{completedAudits}</h2>
            </div>
          </div>

          <div className="audit-summary-card">
            <div className="audit-summary-icon">
              <FaClock />
            </div>

            <div>
              <span>Pending</span>
              <h2>{pendingAudits}</h2>
            </div>
          </div>

          <div className="audit-summary-card">
            <div className="audit-summary-icon">
              <FaExclamationTriangle />
            </div>

            <div>
              <span>Critical Risk</span>
              <h2>{criticalAudits}</h2>
            </div>
          </div>

        </div>

        {/* Table Section */}
        <div className="audit-table-card">

          {/* Filters */}
          <div className="audit-toolbar">

            <div className="audit-search">
              <FaSearch />

              <input
                type="text"
                placeholder="Search audits..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="audit-filters">

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
              >
                <option value="All">All Risks</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

            </div>
          </div>

          {loading && (
            <div className="audit-message">
              Loading audits...
            </div>
          )}

          {error && (
            <div className="audit-message audit-error">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="audit-table-wrapper">

              <table className="audit-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Rule</th>
                    <th>Company</th>
                    <th>Auditor</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Risk</th>
                    <th>Remarks</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredAudits.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="no-audits"
                      >
                        No audits found.
                      </td>
                    </tr>
                  ) : (
                    filteredAudits.map((audit) => (
                      <tr key={audit.audit_id}>

                        <td className="audit-id">
                          #{audit.audit_id}
                        </td>

                        <td className="audit-rule">
                          {audit.rule_name}
                        </td>

                        <td>
                          {audit.company_name}
                        </td>

                        <td>
                          {audit.auditor}
                        </td>

                        <td>
                          <span
                            className={`status-badge ${audit.status.toLowerCase()}`}
                          >
                            {audit.status}
                          </span>
                        </td>

                        <td>
                          {audit.due_date}
                        </td>

                        <td>
                          <span
                            className={`risk-badge ${audit.risk_level.toLowerCase()}`}
                          >
                            {audit.risk_level}
                          </span>
                        </td>

                        <td className="audit-remarks">
                          {audit.remarks}
                        </td>

                      </tr>
                    ))
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Audit;
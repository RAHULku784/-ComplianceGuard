import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getComplianceReport } from "../services/api";

import {
  FaClipboardCheck,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaShieldAlt,
  FaChartLine,
  FaBuilding,
  FaChartBar,
} from "react-icons/fa";


function Reports() {
  const [report, setReport] = useState({
    total_audits: 0,
    completed_audits: 0,
    pending_audits: 0,
    overdue_audits: 0,
    high_risk_audits: 0,
    compliance_score: 0,

    // NEW
    risk_distribution: {
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0,
    },

    company_compliance: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchReport = async () => {
      try {
        setError("");

        const data = await getComplianceReport();

        setReport(data);

      } catch (error) {
        console.error(
          "Compliance report error:",
          error
        );

        setError(
          "Unable to load compliance report."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);


  if (loading) {
    return (
      <div className="dashboard">

        <Sidebar />

        <div className="dashboard-content">

          <div className="reports-message">
            Loading compliance report...
          </div>

        </div>

      </div>
    );
  }


  const riskDistribution =
    report.risk_distribution || {
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0,
    };


  const companyCompliance =
    report.company_compliance || [];


  const maxRiskValue = Math.max(
    riskDistribution.Low || 0,
    riskDistribution.Medium || 0,
    riskDistribution.High || 0,
    riskDistribution.Critical || 0,
    1
  );


  return (
    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-content">


        {/* Header */}

        <div className="reports-header">

          <div>
            <h1>Reports</h1>

            <p>
              Compliance performance and audit
              analytics
            </p>
          </div>

          <div className="reports-header-icon">
            <FaChartLine />
          </div>

        </div>


        {/* Error */}

        {error && (
          <div className="reports-message error">
            {error}
          </div>
        )}


        {!error && (
          <>

            {/* Main Statistics */}

            <div className="reports-stats-grid">


              {/* Total Audits */}

              <div className="report-stat-card">

                <div className="report-stat-top">

                  <div>
                    <span>Total Audits</span>

                    <h2>
                      {report.total_audits}
                    </h2>
                  </div>

                  <div className="report-stat-icon total">
                    <FaClipboardCheck />
                  </div>

                </div>

                <p>
                  All compliance audits
                </p>

              </div>


              {/* Completed */}

              <div className="report-stat-card">

                <div className="report-stat-top">

                  <div>
                    <span>Completed</span>

                    <h2>
                      {report.completed_audits}
                    </h2>
                  </div>

                  <div className="report-stat-icon completed">
                    <FaCheckCircle />
                  </div>

                </div>

                <p>
                  Successfully completed audits
                </p>

              </div>


              {/* Pending */}

              <div className="report-stat-card">

                <div className="report-stat-top">

                  <div>
                    <span>Pending</span>

                    <h2>
                      {report.pending_audits}
                    </h2>
                  </div>

                  <div className="report-stat-icon pending">
                    <FaClock />
                  </div>

                </div>

                <p>
                  Audits requiring completion
                </p>

              </div>


              {/* Overdue */}

              <div className="report-stat-card">

                <div className="report-stat-top">

                  <div>
                    <span>Overdue</span>

                    <h2>
                      {report.overdue_audits}
                    </h2>
                  </div>

                  <div className="report-stat-icon overdue">
                    <FaExclamationTriangle />
                  </div>

                </div>

                <p>
                  Audits past their due date
                </p>

              </div>

            </div>


            {/* Existing Report Details */}

            <div className="reports-bottom-grid">


              {/* Compliance Score */}

              <div className="report-panel">

                <div className="report-panel-header">

                  <div>
                    <h2>
                      Compliance Score
                    </h2>

                    <p>
                      Overall audit completion
                      performance
                    </p>
                  </div>

                  <FaShieldAlt />

                </div>


                <div className="compliance-score-section">

                  <div className="compliance-score-circle">

                    <div>

                      <strong>
                        {report.compliance_score}%
                      </strong>

                      <span>
                        Compliance
                      </span>

                    </div>

                  </div>


                  <div className="compliance-progress-area">

                    <div className="compliance-progress-header">

                      <span>
                        Overall Progress
                      </span>

                      <strong>
                        {report.compliance_score}%
                      </strong>

                    </div>


                    <div className="compliance-progress">

                      <div
                        className="compliance-progress-fill"
                        style={{
                          width: `${report.compliance_score}%`,
                        }}
                      />

                    </div>


                    <p>
                      {report.completed_audits} of{" "}
                      {report.total_audits} audits
                      completed
                    </p>

                  </div>

                </div>

              </div>


              {/* Risk Overview */}

              <div className="report-panel">

                <div className="report-panel-header">

                  <div>
                    <h2>
                      Risk Overview
                    </h2>

                    <p>
                      Current compliance risks
                    </p>
                  </div>

                  <FaExclamationTriangle />

                </div>


                <div className="risk-report-list">


                  <div className="risk-report-item high">

                    <div>

                      <span>
                        High / Critical Risk
                      </span>

                      <p>
                        Open high-severity audits
                      </p>

                    </div>

                    <strong>
                      {report.high_risk_audits}
                    </strong>

                  </div>


                  <div className="risk-report-item overdue">

                    <div>

                      <span>
                        Overdue Audits
                      </span>

                      <p>
                        Past compliance deadline
                      </p>

                    </div>

                    <strong>
                      {report.overdue_audits}
                    </strong>

                  </div>


                  <div className="risk-report-item pending">

                    <div>

                      <span>
                        Pending Audits
                      </span>

                      <p>
                        Awaiting completion
                      </p>

                    </div>

                    <strong>
                      {report.pending_audits}
                    </strong>

                  </div>

                </div>

              </div>

            </div>


            {/* ================================= */}
            {/* NEW ANALYTICS SECTION */}
            {/* ================================= */}

            <div className="report-analytics-grid">


              {/* Risk Distribution */}

              <div className="report-panel analytics-panel">

                <div className="report-panel-header">

                  <div>
                    <h2>
                      Risk Distribution
                    </h2>

                    <p>
                      Audits grouped by severity
                    </p>
                  </div>

                  <FaChartBar />

                </div>


                <div className="risk-distribution-chart">


                  {/* Low */}

                  <div className="risk-chart-row">

                    <div className="risk-chart-label">
                      <span className="risk-dot low" />
                      <span>Low</span>
                    </div>

                    <div className="risk-chart-bar">

                      <div
                        className="risk-chart-fill low"
                        style={{
                          width: `${
                            (
                              riskDistribution.Low /
                              maxRiskValue
                            ) * 100
                          }%`,
                        }}
                      />

                    </div>

                    <strong>
                      {riskDistribution.Low}
                    </strong>

                  </div>


                  {/* Medium */}

                  <div className="risk-chart-row">

                    <div className="risk-chart-label">
                      <span className="risk-dot medium" />
                      <span>Medium</span>
                    </div>

                    <div className="risk-chart-bar">

                      <div
                        className="risk-chart-fill medium"
                        style={{
                          width: `${
                            (
                              riskDistribution.Medium /
                              maxRiskValue
                            ) * 100
                          }%`,
                        }}
                      />

                    </div>

                    <strong>
                      {riskDistribution.Medium}
                    </strong>

                  </div>


                  {/* High */}

                  <div className="risk-chart-row">

                    <div className="risk-chart-label">
                      <span className="risk-dot high" />
                      <span>High</span>
                    </div>

                    <div className="risk-chart-bar">

                      <div
                        className="risk-chart-fill high"
                        style={{
                          width: `${
                            (
                              riskDistribution.High /
                              maxRiskValue
                            ) * 100
                          }%`,
                        }}
                      />

                    </div>

                    <strong>
                      {riskDistribution.High}
                    </strong>

                  </div>


                  {/* Critical */}

                  <div className="risk-chart-row">

                    <div className="risk-chart-label">
                      <span className="risk-dot critical" />
                      <span>Critical</span>
                    </div>

                    <div className="risk-chart-bar">

                      <div
                        className="risk-chart-fill critical"
                        style={{
                          width: `${
                            (
                              riskDistribution.Critical /
                              maxRiskValue
                            ) * 100
                          }%`,
                        }}
                      />

                    </div>

                    <strong>
                      {riskDistribution.Critical}
                    </strong>

                  </div>

                </div>

              </div>


              {/* Company Compliance */}

              <div className="report-panel analytics-panel">

                <div className="report-panel-header">

                  <div>

                    <h2>
                      Company Compliance
                    </h2>

                    <p>
                      Compliance score by company
                    </p>

                  </div>

                  <FaBuilding />

                </div>


                <div className="company-compliance-list">

                  {companyCompliance.length === 0 && (
                    <div className="reports-message">
                      No company data available.
                    </div>
                  )}


                  {companyCompliance.map(
                    (company) => (

                      <div
                        className="company-compliance-item"
                        key={company.company_name}
                      >

                        <div className="company-compliance-top">

                          <div>

                            <strong>
                              {company.company_name}
                            </strong>

                            <span>
                              {company.completed_audits} of{" "}
                              {company.total_audits} completed
                            </span>

                          </div>


                          <strong
                            className={
                              company.compliance_score >= 75
                                ? "company-score good"
                                : company.compliance_score >= 40
                                ? "company-score medium"
                                : "company-score poor"
                            }
                          >
                            {company.compliance_score}%
                          </strong>

                        </div>


                        <div className="company-progress">

                          <div
                            className={
                              company.compliance_score >= 75
                                ? "company-progress-fill good"
                                : company.compliance_score >= 40
                                ? "company-progress-fill medium"
                                : "company-progress-fill poor"
                            }
                            style={{
                              width: `${company.compliance_score}%`,
                            }}
                          />

                        </div>


                        <div className="company-compliance-details">

                          <span>
                            Pending:{" "}
                            {company.pending_audits}
                          </span>

                          <span>
                            Overdue:{" "}
                            {company.overdue_audits}
                          </span>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          </>
        )}

      </div>

    </div>
  );
}


export default Reports;
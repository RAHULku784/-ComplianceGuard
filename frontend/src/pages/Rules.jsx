import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import { getRules } from "../services/api";

import {
  FaBook,
  FaSearch,
  FaPlus,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";


function Rules() {

  const navigate = useNavigate();

  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] =
    useState("all");


  useEffect(() => {

    const fetchRules = async () => {

      try {

        setError("");

        const data = await getRules();

        setRules(data);

      } catch (error) {

        console.error(
          "Rules API error:",
          error
        );

        setError(
          "Unable to load compliance rules."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchRules();

  }, []);


  const filteredRules = rules.filter((rule) => {

    const searchValue =
      search.toLowerCase();

    const matchesSearch =
      rule.rule_name
        ?.toLowerCase()
        .includes(searchValue) ||

      rule.description
        ?.toLowerCase()
        .includes(searchValue) ||

      rule.category
        ?.toLowerCase()
        .includes(searchValue);


    const matchesSeverity =
      severityFilter === "all" ||
      rule.severity === severityFilter;


    return (
      matchesSearch &&
      matchesSeverity
    );

  });


  const activeRules =
    rules.filter(
      (rule) => rule.status === true
    ).length;


  const criticalRules =
    rules.filter(
      (rule) =>
        rule.severity === "Critical"
    ).length;


  const highRules =
    rules.filter(
      (rule) =>
        rule.severity === "High"
    ).length;


  return (

    <div className="dashboard">

      <Sidebar />


      <div className="dashboard-content">


        {/* HEADER */}

        <div className="rules-header">

          <div>

            <h1>
              Compliance Rules
            </h1>

            <p>
              Manage compliance policies and
              audit requirements
            </p>

          </div>


          <button
            className="add-rule-btn"
            onClick={() =>
              navigate("/rules/new")
            }
          >
            <FaPlus />

            New Rule
          </button>

        </div>


        {/* STATISTICS */}

        <div className="rules-stats">


          <div className="rule-stat-card">

            <div className="rule-stat-icon">
              <FaBook />
            </div>

            <div>
              <span>
                Total Rules
              </span>

              <h2>
                {rules.length}
              </h2>
            </div>

          </div>


          <div className="rule-stat-card">

            <div className="rule-stat-icon active">
              <FaCheckCircle />
            </div>

            <div>
              <span>
                Active Rules
              </span>

              <h2>
                {activeRules}
              </h2>
            </div>

          </div>


          <div className="rule-stat-card">

            <div className="rule-stat-icon high">
              <FaExclamationTriangle />
            </div>

            <div>
              <span>
                High Severity
              </span>

              <h2>
                {highRules}
              </h2>
            </div>

          </div>


          <div className="rule-stat-card">

            <div className="rule-stat-icon critical">
              <FaExclamationTriangle />
            </div>

            <div>
              <span>
                Critical Rules
              </span>

              <h2>
                {criticalRules}
              </h2>
            </div>

          </div>


        </div>


        {/* TABLE */}

        <div className="rules-table-container">


          {/* TOOLBAR */}

          <div className="rules-toolbar">


            <div className="rules-search-wrapper">

              <FaSearch />

              <input
                type="text"
                placeholder="Search compliance rules..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

            </div>


            <select
              value={severityFilter}
              onChange={(event) =>
                setSeverityFilter(
                  event.target.value
                )
              }
              className="rules-filter"
            >
              <option value="all">
                All Severity
              </option>

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


          {loading && (

            <div className="rules-message">
              Loading compliance rules...
            </div>

          )}


          {error && (

            <div className="rules-message error">
              {error}
            </div>

          )}


          {!loading && !error && (

            <table className="rules-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Rule</th>
                  <th>Category</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>


              <tbody>

                {filteredRules.map((rule) => (

                  <tr key={rule.rule_id}>

                    <td className="rule-id">
                      #{rule.rule_id}
                    </td>


                    <td>

                      <div className="rule-name-cell">

                        <strong>
                          {rule.rule_name}
                        </strong>

                        <span>
                          {rule.description ||
                            "No description"}
                        </span>

                      </div>

                    </td>


                    <td>
                      {rule.category || "—"}
                    </td>


                    <td>

                      <span
                        className={`rule-severity ${
                          rule.severity
                            ?.toLowerCase()
                        }`}
                      >
                        {rule.severity ||
                          "Unknown"}
                      </span>

                    </td>


                    <td>

                      <span
                        className={
                          rule.status
                            ? "rule-status active"
                            : "rule-status inactive"
                        }
                      >
                        {rule.status
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </td>


                    <td>

                      <button
                        className="rule-view-btn"
                        onClick={() =>
                          navigate(
                            `/rules/${rule.rule_id}`
                          )
                        }
                      >
                        View
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}


          {!loading &&
            !error &&
            filteredRules.length === 0 && (

              <div className="rules-message">
                No compliance rules found.
              </div>

            )}


        </div>


      </div>

    </div>

  );

}


export default Rules;
import {
  FaUsers,
  FaClipboardCheck,
  FaShieldAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

function StatCard({ title, value, subtitle, color }) {
  const icons = {
    blue: <FaUsers />,
    green: <FaClipboardCheck />,
    purple: <FaShieldAlt />,
    orange: <FaExclamationTriangle />,
  };

  return (
    <div className={`stat-card ${color}`}>

      <div className="card-top">

        <div>
          <h3>{title}</h3>
          <h1>{value}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="card-icon">
          {icons[color]}
        </div>

      </div>

    </div>
  );
}

export default StatCard;
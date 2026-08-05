import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const auditData = [
  { month: "Feb", audits: 25 },
  { month: "Mar", audits: 38 },
  { month: "Apr", audits: 45 },
  { month: "May", audits: 60 },
  { month: "Jun", audits: 78 },
];

const complianceData = [
  { name: "Passed", value: 92 },
  { name: "Pending", value: 8 },
];

const COLORS = ["#3B82F6", "#F97316"];

function Charts() {
  return (
    <div className="bottom">
      {/* Weekly Performance */}

      <div className="panel">

        <h2>Weekly Performance</h2>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={auditData}>

            <CartesianGrid
              stroke="#334155"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "#CBD5E1" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#CBD5E1" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid #334155",
                borderRadius: "12px",
                color: "#fff",
              }}
            />

            <Bar
              dataKey="audits"
              fill="#3B82F6"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>
        </ResponsiveContainer>

      </div>

      {/* Compliance Status */}

      <div className="panel">

        <h2>Compliance Status</h2>

        <ResponsiveContainer width="100%" height={320}>
          <PieChart>

            <Pie
              data={complianceData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={95}
              label
            >
              {complianceData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                background: "#111827",
                borderRadius: "12px",
                border: "1px solid #334155",
                color: "#fff",
              }}
            />

            <Legend
              verticalAlign="bottom"
              iconType="circle"
            />

          </PieChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default Charts;
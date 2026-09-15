import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [roleId] = useState(4);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        full_name: fullName,
        email: email,
        password: password,
        phone_number: phoneNumber || null,
        role_id: roleId,
}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Signup failed");
      }

      alert("Account created successfully!");

      navigate("/login");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>ComplianceGuard</h1>
        <p> Create your account</p>

        <form
           onSubmit={handleSignup}
           style={{
           display: "flex",
           flexDirection: "column",
           gap: "18px",
           width: "100%",
           marginTop: "30px",
  }}
>

         <input
  type="text"
  placeholder="Full name"
  value={fullName}
  onChange={(e) => setFullName(e.target.value)}
  required
  style={{
    width: "100%",
    padding: "18px 20px",
    fontSize: "16px",
    borderRadius: "10px",
    boxSizing: "border-box",
  }}
/>

         <input
  type="email"
  placeholder="Email address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  style={{
    width: "100%",
    padding: "18px 20px",
    fontSize: "16px",
    borderRadius: "10px",
    boxSizing: "border-box",
  }}
/>
  <input
  type="tel"
  placeholder="Phone number (optional)"
  value={phoneNumber}
  onChange={(e) => setPhoneNumber(e.target.value)}
  style={{
    width: "100%",
    padding: "18px 20px",
    fontSize: "16px",
    borderRadius: "10px",
    boxSizing: "border-box",
  }}
/>



          <input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
  style={{
    width: "100%",
    padding: "18px 20px",
    fontSize: "16px",
    borderRadius: "10px",
    boxSizing: "border-box",
  }}
/>

          {error && (
            <p style={{ color: "#ff6b6b" }}>
              {error}
            </p>
          )}

          <button
  type="submit"
  disabled={loading}
  style={{
    width: "100%",
    padding: "18px",
    fontSize: "18px",
    borderRadius: "10px",
    cursor: "pointer",
  }}
>
  {loading ? "Creating Account..." : "Sign Up"}
</button>

        </form>

        <p style={{ marginTop: "20px" }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{
              color: "#3b82f6",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Sign In
          </span>
        </p>

      </div>

    </div>
  );
}

export default Signup;
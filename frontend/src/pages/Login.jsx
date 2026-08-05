import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Invalid email or password");
      }

      localStorage.setItem("access_token", data.access_token);

      navigate("/dashboard", { replace: true });

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        color: "white",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "380px",
          padding: "40px",
          background: "#111c30",
          borderRadius: "16px",
        }}
      >
        <p style={{ marginTop: "20px" }}>
          Don't have an account?{" "}
         <span
            onClick={() => navigate("/signup")}
            style={{
               color: "#3b82f6",
               cursor: "pointer",
               fontWeight: "bold",
        }}
      >
        Sign Up
    </span>
</p>




        <h1 style={{ marginBottom: "10px" }}>
          ComplianceGuard
        </h1>

        <p
          style={{
            marginBottom: "30px",
            color: "#94a3b8",
          }}
        >
          Sign in to your account
        </p>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #334155",
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
            padding: "14px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #334155",
            boxSizing: "border-box",
          }}
        />

        {error && (
          <p
            style={{
              color: "#f87171",
              marginBottom: "15px",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "8px",
            background: "#3b82f6",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
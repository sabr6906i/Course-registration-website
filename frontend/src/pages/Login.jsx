import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      // Step 1: send username/password, get back a JWT token
      const tokenRes = await api.post("token/", { username, password });
      localStorage.setItem("token", tokenRes.data.access);

      // Step 2: fetch user info so we know if they are admin
      const meRes = await api.get("me/");
      localStorage.setItem("username", meRes.data.username);
      localStorage.setItem("is_staff", meRes.data.is_staff);

      navigate("/");
      window.location.reload(); // reload so navbar shows correct links
    } catch (err) {
      setError("Invalid username or password.");
    }
  }

  return (
    <div className="auth-container">
      <div className="card">
        <h2>Login</h2>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
            Login
          </button>
        </form>

        <p style={{ marginTop: "16px", fontSize: "14px", textAlign: "center" }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

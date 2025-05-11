// src/pages/Login.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import styles from "./Login.module.css";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();
  const location                = useLocation();

  // ① SSO callback: pick up ?token=… and redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get("token");
    if (token) {
      localStorage.setItem("jwt", token);
      // remove the token from the URL
      window.history.replaceState({}, "", window.location.pathname);
      // send user to their last-wanted page (or /rooms)
      navigate("/rooms", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setLoading(true);

    try {
      // login() should POST to /api/auth/login and return { role, ... }
      const user = await login(email, password);

      // decide where to go next
      const dest =
        user.role === "admin"
          ? "/admin"
          : (location.state as any)?.from?.pathname || "/rooms";

      navigate(dest, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.msg || "Login failed");
      setLoading(false);
    }
  };

  const handleSSO = () => {
    // thanks to your Vite proxy, this will actually hit
    // http://localhost:5000/api/auth/login/sso
    window.location.href = "/api/auth/login/sso";
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Login</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="emailInput" className={styles.label}>
            Email
          </label>
          <input
            id="emailInput"
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="passwordInput" className={styles.label}>
            Password
          </label>
          <input
            id="passwordInput"
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading || !email || !password}
        >
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>

      <p className={styles.or}>— or —</p>

      <button
        type="button"
        className={styles.ssoButton}
        onClick={handleSSO}
        disabled={loading}
      >
        Login with HCMUT SSO
      </button>

      {error && <p className={styles.errorMessage}>{error}</p>}

      <p className={styles.link}>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import styles from './Register.module.css'; // Import the CSS module

export default function Register() {
  const { register: signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Renamed for clarity
  const [error, setError] = useState(""); // Renamed for clarity
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate(); // Renamed for clarity

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault(); // Prevent default form submission

    // Basic validation check (consider adding password strength check)
    if (password.length < 6) {
       setError("Password must be at least 6 characters long.");
       return;
    }

    setError(""); // Clear previous errors
    setLoading(true); // Set loading true

    try {
      await signup(email, password);
      // On successful registration, navigate to a relevant page (e.g., rooms or login)
      // Often good practice to show a success message before redirecting or require login
      // For simplicity, redirecting directly to rooms as per original code
      navigate("/rooms", { replace: true });
    } catch (e: any) {
      console.error("Register: error during signup", e);
      const errorMessage = e?.response?.data?.msg || e?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      setLoading(false); // Set loading false on error
    }
    // No setLoading(false) here on success because navigation occurs
  };

  return (
    // Apply container style
    <div className={styles.container}>
      {/* Apply title style */}
      <h2 className={styles.title}>Create Account</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Apply form group style */}
        <div className={styles.formGroup}>
          <label htmlFor="emailInput" className={styles.label}>Email</label>
          <input
            id="emailInput"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="you@example.com"
            disabled={loading}
          />
        </div>

        {/* Apply form group style */}
        <div className={styles.formGroup}>
          <label htmlFor="passwordInput" className={styles.label}>Password</label>
          <input
            id="passwordInput"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            minLength={6} // Add minLength for basic validation
            placeholder="Choose a password (min. 6 characters)"
            disabled={loading}
          />
        </div>

        {/* Apply button style */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading || !email || !password || password.length < 6} // Add validation to disabled check
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      {/* Apply error message style */}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Apply link container and link styles (using renamed classes) */}
      <p className={styles.loginLinkContainer}>
        Already have an account?{" "}
        <Link to="/login" className={styles.loginLink}>
          Login
        </Link>
      </p>
    </div>
  );
}
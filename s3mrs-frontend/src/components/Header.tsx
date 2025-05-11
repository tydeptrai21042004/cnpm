// src/components/Header.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from './Header.module.css'; // Import the CSS module

export default function Header() {
  const { user, logout } = useAuth();

  return (
    // Apply header style
    <header className={styles.header}>

      {/* Apply navigation style */}
      <nav className={styles.navigation}>
        <Link to="/" className={styles.navLink}>Home</Link> {/* Apply navLink style */}
        <Link to="/rooms" className={styles.navLink}>Rooms</Link> {/* Apply navLink style */}

        {/* Student Links */}
        {user?.role === "student" && (
          <>
            <Link to="/bookings" className={styles.navLink}>My bookings</Link> {/* Apply navLink style */}
            <Link to="/chat" className={styles.navLink}>Chat</Link> {/* Apply navLink style */}
          </>
        )}

        {/* Admin Links */}
        {user?.role === "admin" && (
          <>
            <Link to="/admin" className={styles.navLink}>Dashboard</Link> {/* Apply navLink style */}
            <Link to="/admin/rooms" className={styles.navLink}>Manage Rooms</Link> {/* Apply navLink style */}
            <Link to="/admin/requests" className={styles.navLink}>Requests</Link> {/* Apply navLink style */}
            <Link to="/admin/chat" className={styles.navLink}>Chat</Link>
          </>
        )}
      </nav>

      {/* Apply auth actions style */}
      <div className={styles.authActions}>
        {user ? (
          // Apply logout button style
          <button onClick={logout} className={styles.logoutButton}>Logout</button>
        ) : (
          // Apply auth link style
          <>
            <Link to="/login" className={styles.authLink}>Login</Link>
            <Link to="/register" className={styles.authLink}>Register</Link>
          </>
        )}
      </div>
    </header>
  );
}
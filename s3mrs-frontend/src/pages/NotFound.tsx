import { Link } from "react-router-dom";
import styles from './NotFound.module.css'; // Import the CSS module

export default function NotFound() {
  return (
    // Apply container style, remove inline styles
    <div className={styles.container}>
      {/* Apply title style */}
      {/* Optional: Split 404 and text for separate styling */}
      <h1 className={styles.title}>
        <span className={styles.errorCode}>404</span>
        <br/> {/* Line break for better structure */}
        <span className={styles.message}>Oops! Page Not Found</span>
      </h1>
      {/* Apply link style */}
      <Link to="/rooms" className={styles.homeLink}>
        Go Home
      </Link>
    </div>
  );
}
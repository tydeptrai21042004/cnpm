import { Link } from 'react-router-dom'; // Import Link for internal navigation
import styles from './Footer.module.css'; // Import the CSS module

// You might use an icon library like react-icons
// import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  // Get current date/time for display (optional)
  const currentTime = new Date().toLocaleString('en-VN', { timeZone: 'Asia/Ho_Chi_Minh' });


  return (
    // Apply the main footer style
    <footer className={styles.footer}>
      {/* Container for the main content */}
      <div className={styles.footerContent}>

        {/* Section 1: About/Description */}
        <div className={styles.footerSection}>
          <h5>Smart Study Space Reservation</h5>
          <p>
            Efficiently find and book study rooms at your convenience. Your dedicated space for focus and productivity.
          </p>
          {/* Display current time - Optional */}
          <p style={{fontSize: '0.8em', marginTop: '0.5rem'}}>Local Time (VN): {currentTime}</p>
        </div>

        {/* Section 2: Quick Links */}
        <div className={styles.footerSection}>
          <h5>Quick Links</h5>
          <ul className={styles.footerLinks}>
            <li className={styles.footerLinkItem}>
              <Link to="/" className={styles.footerLink}>Home</Link>
            </li>
            <li className={styles.footerLinkItem}>
              <Link to="/rooms" className={styles.footerLink}>Find a Room</Link>
            </li>
            <li className={styles.footerLinkItem}>
              <Link to="/bookings" className={styles.footerLink}>My Bookings</Link>
            </li>
            {/* Add more internal links as needed */}
            <li className={styles.footerLinkItem}>
              <a href="/faq" className={styles.footerLink}>FAQ</a> {/* Example external/placeholder */}
            </li>
            <li className={styles.footerLinkItem}>
               <a href="/terms" className={styles.footerLink}>Terms of Service</a> {/* Example external/placeholder */}
            </li>
          </ul>
        </div>

        {/* Section 3: Contact/Social */}
        <div className={styles.footerSection}>
          <h5>Connect With Us</h5>
           {/* Add Contact Info if desired */}
           {/* <p>Email: contact@s3mrs.com</p> */}
           {/* <p>Phone: +84 123 456 789</p> */}
          <ul className={styles.socialLinks}>
             {/* Replace # with actual links and use real icons */}
            <li className={styles.socialLink}>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                {/* <FaFacebook />  Use icon library component here */} F
              </a>
            </li>
            <li className={styles.socialLink}>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                {/* <FaTwitter /> Use icon library component here */} T
              </a>
            </li>
            <li className={styles.socialLink}>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                {/* <FaLinkedin /> Use icon library component here */} L
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright notice at the bottom */}
      <div className={styles.copyright}>
        <small>&copy; {currentYear} S3‑MRS. All Rights Reserved.</small>
      </div>
    </footer>
  );
}
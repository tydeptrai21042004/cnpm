import { useState, useEffect } from "react";
import api from "../api";
import { Booking } from "../types"; // Assuming Booking type has a 'state' field
import styles from './MyBookings.module.css'; // Import the CSS module

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get<Booking[]>("/bookings/mine")
      .then(res => {
        setBookings(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch bookings:", err);
        setError("Could not load your bookings. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Helper function to get status style class
  const getStatusClass = (status: string): string => {
      // Ensure consistent casing
      const lowerCaseStatus = status.toLowerCase();
      switch (lowerCaseStatus) {
          case 'confirmed':
              return styles.statusConfirmed;
          case 'pending':
              return styles.statusPending;
          case 'cancelled':
              return styles.statusCancelled;
           case 'declined':
              return styles.statusDeclined;
          default:
              console.warn(`Unknown booking status encountered: ${status}`);
              return styles.statusUnknown; // Fallback style
      }
  }

  // Helper to format date/time nicely
  const formatDateTime = (dateString: string) => {
      try {
          const date = new Date(dateString);
          // Using browser's locale. Adjust options as needed.
          // As of May 6, 2025.
          return date.toLocaleString([], {
              year: 'numeric', month: 'short', day: 'numeric',
              hour: '2-digit', minute: '2-digit', hour12: true // Example: May 6, 2025, 06:55 AM
          });
      } catch (e) {
          console.error("Error formatting date:", dateString, e);
          return "Invalid Date";
      }
  }


  // --- Render Logic ---
  if (loading) {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>My Booking History</h2>
            <p className={styles.loading}>Loading your bookings...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>My Booking History</h2>
            <p className={styles.error}>{error}</p>
        </div>
    );
  }

  return (
    // Apply container style
    <div className={styles.container}>
      {/* Apply title style */}
      <h2 className={styles.title}>My Booking History</h2>

      {bookings.length === 0 ? (
         <p className={styles.noBookingsMessage}>You haven't made any bookings yet.</p>
      ) : (
         // Add container for horizontal scroll if needed
         <div className={styles.tableContainer}>
            {/* Apply table style, remove HTML attributes */}
            <table className={styles.bookingsTable}>
                <thead className={styles.tableHead}>
                <tr>
                    <th className={styles.tableHeader}>Room ID</th>
                    <th className={styles.tableHeader}>Start Time</th>
                    <th className={styles.tableHeader}>End Time</th>
                    <th className={styles.tableHeader}>Status</th>
                </tr>
                </thead>
                <tbody className={styles.tableBody}>
                {bookings.map(b => (
                    <tr key={b._id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{b.room_id}</td>
                    <td className={styles.tableCell}>{formatDateTime(b.start)}</td>
                    <td className={styles.tableCell}>{formatDateTime(b.end)}</td>
                    {/* Apply cell style and add styled span for status */}
                    <td className={`${styles.tableCell} ${styles.statusCell}`}>
                        <span className={`${styles.statusBadge} ${getStatusClass(b.state)}`}>
                        {b.state}
                        </span>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
         </div>
      )}
    </div>
  );
}
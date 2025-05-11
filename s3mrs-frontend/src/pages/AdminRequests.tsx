import { useState, useEffect } from "react";
import api from "../api";
import { BookingRequest } from "../types";
import styles from './AdminRequests.module.css'; // Import the CSS module

export default function AdminRequests() {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  // Load pending requests on mount
  useEffect(() => {
    async function loadRequests() {
      setLoading(true); // Start loading
      setError(null); // Reset error
      try {
        const res = await api.get<BookingRequest[]>("/bookings/requests");
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to fetch booking requests", err);
        setError("Failed to load booking requests. Please try again later.");
      } finally {
        setLoading(false); // Finish loading
      }
    }
    loadRequests();
  }, []);

  // Approve or decline a request
  const act = async (id: string, action: "approve" | "decline") => {
    try {
      await api.patch(`/bookings/${id}/${action}`);
      // Remove from list optimistically
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(`${action} failed`, err);
      // Optionally show an error message to the user
      alert(`Failed to ${action} the request. Please try again.`);
    }
  };

  // Helper to format date/time nicely
  const formatDateTime = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleString([], { // Use browser's locale
          dateStyle: 'medium', // e.g., May 6, 2025
          timeStyle: 'short' // e.g., 6:30 AM
      });
  }

  // Render loading state
  if (loading) {
    return (
      <div className={`${styles.container} ${styles.loading}`}>
        Loading booking requests...
      </div>
    );
  }

  // Render error state
  if (error) {
      return (
          <div className={styles.container}>
              <h2 className={styles.title}>Booking Requests</h2>
              <p className={styles.noRequests} style={{ color: 'red' }}>{error}</p>
          </div>
      )
  }

  // Render main component
  return (
    // Apply container style
    <div className={styles.container}>
      {/* Apply title style */}
      <h2 className={styles.title}>Booking Requests</h2>

      {requests.length === 0 ? (
        // Apply 'no requests' style
        <p className={styles.noRequests}>No pending requests.</p>
      ) : (
        // Apply request list style
        <ul className={styles.requestList}>
          {requests.map((r) => (
            // Apply request item style
            <li key={r._id} className={styles.requestItem}>
              {/* Structure details using grid */}
              <div className={styles.requestDetails}>
                <span className={styles.detailLabel}>User ID:</span>
                <span className={styles.detailValue}>{r.user_id}</span>

                <span className={styles.detailLabel}>Room ID:</span>
                <span className={styles.detailValue}>{r.room_id}</span>

                <span className={styles.detailLabel}>From:</span>
                <span className={styles.detailValue}>{formatDateTime(r.start)}</span>

                <span className={styles.detailLabel}>To:</span>
                <span className={styles.detailValue}>{formatDateTime(r.end)}</span>
              </div>

              {/* Actions container */}
              <div className={styles.requestActions}>
                {/* Apply button styles */}
                <button
                  onClick={() => act(r._id, "approve")}
                  className={`${styles.actionButton} ${styles.approveButton}`}
                >
                  Approve
                </button>
                <button
                  onClick={() => act(r._id, "decline")}
                  className={`${styles.actionButton} ${styles.declineButton}`}
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
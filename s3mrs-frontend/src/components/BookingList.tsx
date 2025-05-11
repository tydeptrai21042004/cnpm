import useBookings from "../hooks/useBookings";
import styles from './BookingList.module.css'; // Import the CSS module

export default function BookingList() {
  const { bookings, loading } = useBookings();

  // Helper function to get state class (optional, but good for specific styling)
  const getStateClass = (state: string) => {
    switch (state?.toLowerCase()) {
      case 'confirmed':
        return styles.stateConfirmed;
      case 'pending':
        return styles.statePending;
      case 'cancelled':
         return styles.stateCancelled;
      default:
        return ''; // No extra class if state is unknown or default
    }
  };

  if (loading) return <p className={styles.loadingMessage}>Loading…</p>; // Apply style
  if (!bookings.length) return <p className={styles.noBookingsMessage}>No bookings yet.</p>; // Apply style

  return (
    // Add a container div
    <div className={styles.container}>
      <h2 className={styles.title}>My bookings</h2> {/* Apply title style */}
      <ul className={styles.bookingList}> {/* Apply list style */}
        {bookings.map((b) => (
          <li key={b._id} className={styles.bookingItem}> {/* Apply item style */}
            <span className={styles.roomInfo}>Room {b.room_id}</span> – {/* Style room info */}
            {new Date(b.start).toLocaleString()} →{" "}
            {new Date(b.end).toLocaleString()}
            {/* Apply base state style + conditional state style */}
            <span className={`${styles.bookingState} ${getStateClass(b.state)}`}>
              {b.state || 'N/A'} {/* Show state or N/A */}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
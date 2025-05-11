import { Room } from "../types";
import styles from './RoomCard.module.css'; // Import the CSS module

interface Props {
  room: Room;
  onSelect: (room: Room) => void;
}

export default function RoomCard({ room, onSelect }: Props) {

  // Helper function to get the appropriate CSS class based on room status
  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return styles.statusAvailable;
      case 'occupied':
        return styles.statusOccupied;
      case 'maintenance':
        return styles.statusMaintenance;
      default:
        return ''; // No specific color class if status is unknown
    }
  };

  return (
    // Apply the card style
    <div className={styles.card}>
      {/* Apply title style */}
      <h3 className={styles.title}>
        {room.name} – {room.capacity} seats
      </h3>
      {/* Apply details style */}
      <p className={styles.details}>Type: {room.type}</p>
      {/* Apply base status style and conditional color style */}
      <p className={`${styles.details} ${styles.status} ${getStatusClass(room.status)}`}>
        Status: {room.status || 'Unknown'} {/* Handle potential missing status */}
      </p>
      {/* Apply button style */}
      <button
        className={styles.reserveButton}
        disabled={room.status !== "available"} // Logic remains the same
        onClick={() => onSelect(room)} // Logic remains the same
      >
        Reserve
      </button>
    </div>
  );
}
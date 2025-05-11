import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ChatUser } from "../types";
import styles from './AdminChatUsers.module.css'; // Import the CSS module

export default function AdminChatUsers() {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    api.get<ChatUser[]>("/chat/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Failed to load chat users:", err)); // Add error handling
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    // Apply container style
    <div className={styles.container}>
      {/* Apply title style */}
      <h2 className={styles.title}>Chat – Select a user</h2>

      {/* Apply user list style */}
      <ul className={styles.userList}>
        {users.length > 0 ? (
            users.map(u => (
            // Apply user item style
            <li key={u.id} className={styles.userItem}>
                {/* Wrap email in a span for better flex control */}
                <span className={styles.userEmail} title={u.email}> {/* Add title for full email on hover */}
                {u.email}
                </span>
                {/* Apply button style */}
                <button
                onClick={() => nav(`/admin/chat/${u.id}`)} // Logic remains the same
                className={styles.openChatButton}
                >
                Open Chat
                </button>
            </li>
            ))
        ) : (
            // Optional: Display a message if no users are found
            <p>No users available for chat.</p>
        )}
      </ul>
    </div>
  );
}
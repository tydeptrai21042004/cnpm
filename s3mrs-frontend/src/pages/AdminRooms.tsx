import React, { useState, useEffect } from "react";
import api from "../api";
import { Room } from "../types";
import RoomPositionSelector, { Position } from "../components/RoomPositionSelector";
import styles from './AdminRooms.module.css'; // Import the CSS module

// Define the exact shape of our form state
interface RoomForm {
  name: string;
  capacity: number;
  type: string;
  position: Position;    // always non-null
}

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<RoomForm>({
    name: "",
    capacity: 1,
    type: "",
    position: { x: 0, y: 0, z: 0 },
  });

  // Load rooms once
  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get<Room[]>("/rooms")
       .then(res => setRooms(res.data))
       .catch(err => {
            console.error("Failed to fetch rooms", err);
            setError("Failed to load rooms. Please try again later.");
       })
       .finally(() => setLoading(false));
  }, []);

  // Create
  const createRoom = async () => {
    // Basic validation (optional)
    if (!form.name.trim() || !form.type.trim() || form.capacity <= 0) {
        alert("Please fill in all fields correctly.");
        return;
    }
    try {
      await api.post("/rooms", form);
      // Refetch list after creation
      const res = await api.get<Room[]>("/rooms");
      setRooms(res.data);
      // Reset form to valid default
      setForm({
        name: "",
        capacity: 1,
        type: "",
        position: { x: 0, y: 0, z: 0 },
      });
    } catch (err) {
      console.error("Create room failed", err);
      alert("Failed to create room."); // User feedback
    }
  };

  // Delete
  const deleteRoom = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await api.delete(`/rooms/${id}`);
      // Update state optimistically
      setRooms(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error("Delete room failed", err);
      alert("Failed to delete room."); // User feedback
    }
  };

  // Rename
  const updateRoomName = async (id: string, current: string) => {
    const newName = prompt("Enter new room name:", current);
    if (!newName || newName.trim() === "" || newName === current) return; // Check if name is valid and changed
    try {
      await api.patch(`/rooms/${id}`, { name: newName.trim() });
       // Update state optimistically
      setRooms(prev =>
        prev.map(r => (r._id === id ? { ...r, name: newName.trim() } : r))
      );
    } catch (err) {
      console.error("Update room failed", err);
       alert("Failed to update room name."); // User feedback
    }
  };

  // Toggle light
  const toggleLight = async (room: Room) => {
    try {
      await api.patch(`/rooms/${room._id}/light`, { light: !room.light });
       // Update state optimistically
      setRooms(prev =>
        prev.map(r =>
          r._id === room._id ? { ...r, light: !room.light } : r
        )
      );
    } catch (err) {
      console.error("Toggle light failed", err);
       alert("Failed to toggle light status."); // User feedback
    }
  };

  // --- Render Logic ---
  if (loading) {
    return <div className={styles.loading}>Loading Room Data...</div>;
  }

  if (error) {
       return (
           <div className={styles.container}>
               <h2 className={styles.title}>Manage Rooms</h2>
               <p className={styles.noRequests} style={{ color: 'red' }}>{error}</p>
           </div>
       )
   }


  return (
    // Apply container style
    <div className={styles.container}>
      {/* Apply title style */}
      <h2 className={styles.title}>Manage Rooms</h2>

      {/* Apply form container style */}
      <div className={styles.addRoomForm}>
        <h3 className={styles.formSectionTitle}>Add New Room</h3>
        {/* Group inputs for better structure and styling */}
        <div className={styles.formGroup}>
            <label htmlFor="roomName" className={styles.formLabel}>Name</label>
            <input
                id="roomName"
                className={styles.formInput}
                placeholder="e.g., Conference Room A"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            />
        </div>

        <div className={styles.formGroup}>
            <label htmlFor="roomCapacity" className={styles.formLabel}>Capacity</label>
            <input
                id="roomCapacity"
                className={styles.formInput}
                type="number"
                min="1"
                placeholder="Capacity"
                value={form.capacity}
                onChange={e => setForm(prev => ({ ...prev, capacity: Number(e.target.value) || 1 }))}
            />
         </div>

        <div className={styles.formGroup}>
            <label htmlFor="roomType" className={styles.formLabel}>Type</label>
            <input
                id="roomType"
                className={styles.formInput}
                placeholder="e.g., Meeting, Office"
                value={form.type}
                onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
            />
        </div>

        {/* Position Selector */}
         <div className={styles.positionSelectorContainer}>
             <label className={styles.formLabel}>Position</label>
             <RoomPositionSelector
                 // Use null for position prop if component handles it, otherwise keep current logic
                 // position={form.position === null ? undefined : form.position}
                 position={form.position} // Assuming it expects a non-null position
                 setPosition={(pos: Position | null) => { // Handle potential null if selector returns it
                     if (pos) { // Only update if a valid position is returned
                         setForm(prev => ({...prev, position: pos }));
                     }
                 }}
             />
         </div>

        {/* Apply button style */}
        <button onClick={createRoom} className={styles.addButton}>Add Room</button>
      </div>


      {/* Room List Table */}
      <div className={styles.tableContainer}>
          <table className={styles.roomTable}>
            <thead className={styles.tableHead}>
              <tr>
                <th className={styles.tableHeader}>Name</th>
                <th className={styles.tableHeader}>Capacity</th>
                <th className={styles.tableHeader}>Type</th>
                <th className={styles.tableHeader}>Status</th>
                <th className={styles.tableHeader}>Position</th>
                <th className={styles.tableHeader}>Light</th>
                <th className={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {rooms.map(r => (
                <tr key={r._id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{r.name}</td>
                  <td className={styles.tableCell}>{r.capacity}</td>
                  <td className={styles.tableCell}>{r.type}</td>
                  <td className={styles.tableCell}>{r.status}</td>
                  <td className={`${styles.tableCell} ${styles.positionCell}`}>
                     {/* Ensure position exists before accessing */}
                    {r.position ? `(${r.position.x}, ${r.position.y}, ${r.position.z})` : 'N/A'}
                  </td>
                  <td className={styles.tableCell}>
                    <button
                        onClick={() => toggleLight(r)}
                        className={`${styles.tableButton} ${styles.lightButton} ${r.light ? styles.lightButtonOn : styles.lightButtonOff}`}
                        title={r.light ? "Turn Light Off" : "Turn Light On"}
                    >
                       💡 {r.light ? "On" : "Off"}
                    </button>
                  </td>
                  <td className={`${styles.tableCell} ${styles.actionsCell}`}>
                    <button
                        onClick={() => updateRoomName(r._id, r.name)}
                        className={`${styles.tableButton} ${styles.editButton}`}
                        title="Edit Room Name"
                    >
                      Edit
                    </button>
                    <button
                        onClick={() => deleteRoom(r._id)}
                        className={`${styles.tableButton} ${styles.deleteButton}`}
                         title="Delete Room"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
       </div>
    </div>
  );
}
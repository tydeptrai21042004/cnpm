// src/pages/SearchRooms.tsx
import { useState } from "react";
import useRooms from "../hooks/useRooms";
import RoomCard from "../components/RoomCard";
import BookingForm from "../components/BookingForm";
import RoomPositionSelector from "../components/RoomPositionSelector";
import { Room } from "../types";
import { useAuth } from "../contexts/AuthContext";
import styles from './SearchRooms.module.css';

export default function SearchRooms() {
  const { rooms, loading } = useRooms();
  const { logout } = useAuth();
  const [selected, setSelected] = useState<Room | null>(null);
  const [mapView, setMapView] = useState(false);
  const [pickPos, setPickPos] = useState({ x: 0, y: 0, z: 0 });

  if (loading) return <p>Loading rooms…</p>;

  const roomsAtPos = rooms.filter(
    (r) =>
      r.position.x === pickPos.x &&
      r.position.y === pickPos.y &&
      r.position.z === pickPos.z
  );

  return (
    <div style={{ padding: "0 24px" }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Study rooms</h1>
        <div>
          <button onClick={() => setMapView((m) => !m)}>
            {mapView ? "List View" : "Map View"}
          </button>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {mapView ? (
        <RoomPositionSelector
          position={pickPos}
          setPosition={setPickPos}
        />
      ) : (
        rooms.map((r) => (
          <RoomCard key={r._id} room={r} onSelect={setSelected} />
        ))
      )}

      {mapView && roomsAtPos.length > 0 && (
        <div>
          <h3>Rooms at selected position:</h3>
          {roomsAtPos.map((r) => (
            <RoomCard key={r._id} room={r} onSelect={setSelected} />
          ))}
        </div>
      )}

      {selected && <BookingForm room={selected} />}
    </div>
  );
}

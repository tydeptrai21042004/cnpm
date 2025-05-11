// src/components/BookingForm.tsx

import { useState } from "react";
import api from "../api";
import { Room } from "../types";
import { useNavigate } from "react-router-dom";
import styles from "./BookingForm.module.css";

export default function BookingForm({ room }: { room: Room }) {
  const nav = useNavigate();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [err, setErr] = useState("");

  const submit = async () => {
    // Basic validation
    if (!start || !end) {
      setErr("Please select both start and end times.");
      return;
    }
    if (new Date(start) >= new Date(end)) {
      setErr("End time must be after start time.");
      return;
    }
    setErr("");

    try {
      await api.post("/bookings", {
        room_id: room._id,
        start,
        end,
      });
      nav("/bookings");
    } catch (e: any) {
      setErr(e?.response?.data?.msg || "An error occurred during booking.");
    }
  };

  return (
    <div className={styles.formContainer}>
      <h4 className={styles.formTitle}>Reserve {room.name}</h4>

      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor={`start-time-${room._id}`}>
          Start Time:
        </label>
        <input
          id={`start-time-${room._id}`}
          className={styles.input}
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor={`end-time-${room._id}`}>
          End Time:
        </label>
        <input
          id={`end-time-${room._id}`}
          className={styles.input}
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
      </div>

      <div className={styles.buttonContainer}>
        <button onClick={submit} className={styles.submitButton}>
          Confirm Reservation
        </button>
      </div>

      {err && <p className={styles.errorMessage}>{err}</p>}
    </div>
  );
}

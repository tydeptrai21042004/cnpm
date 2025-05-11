import { useEffect, useState } from "react";
import api from "../api";
import { Booking } from "../types";

export default function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Booking[]>("/bookings/mine")
      .then((r) => setBookings(r.data))
      .finally(() => setLoading(false));
  }, []);

  return { bookings, loading };
}
